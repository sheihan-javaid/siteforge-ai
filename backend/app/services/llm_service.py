from __future__ import annotations

import json
import logging
import re
from functools import lru_cache
from typing import Optional

from huggingface_hub import AsyncInferenceClient

from app.core.config import get_settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are SiteForge AI. Generate ONLY valid JSON for a website with no extra text, explanation, or markdown.

STRICT JSON FORMAT:
{
  "seo": {
    "title": "Page Title | Brand Name",
    "description": "Meta description under 160 characters",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "og_title": "Open Graph Title",
    "og_description": "Open Graph description"
  },
  "navbar": {
    "logo": "Brand Name",
    "links": ["Home", "About", "Contact"]
  },
  "hero": {
    "title": "string",
    "subtitle": "string",
    "cta": "string"
  },
  "features": [
    {"title": "string", "description": "string", "icon": "🚀"},
    {"title": "string", "description": "string", "icon": "⚡"}
  ],
  "gallery": [
    {"url": "https://picsum.photos/seed/nature/600/400", "alt": "string", "caption": "string"},
    {"url": "https://picsum.photos/seed/city/600/400", "alt": "string", "caption": "string"},
    {"url": "https://picsum.photos/seed/work/600/400", "alt": "string", "caption": "string"}
  ],
  "contact": {
    "title": "Get In Touch",
    "subtitle": "string",
    "fields": [
      {"label": "Name", "type": "text", "placeholder": "Your name"},
      {"label": "Email", "type": "email", "placeholder": "your@email.com"},
      {"label": "Message", "type": "textarea", "placeholder": "Your message"}
    ],
    "submit_label": "Send Message"
  },
  "footer": {
    "text": "© 2026 Brand. All rights reserved.",
    "social": ["twitter", "github", "linkedin"]
  }
}

Rules:
- SEO title must be under 60 characters
- SEO description must be under 160 characters
- Keywords should be 3-6 relevant terms
- Features should be 2-4 items
- Gallery should be 3-6 images using https://picsum.photos/seed/{relevant_word}/600/400 with seed words relevant to the prompt
- Contact form fields should match the website type
- All content must be specific and relevant to the user's prompt
- Return ONLY the JSON object, nothing else"""


@lru_cache(maxsize=1)
def get_client() -> AsyncInferenceClient:
    settings = get_settings()
    if not settings.huggingface_api_key:
        raise ValueError("Hugging Face API key not configured")

    return AsyncInferenceClient(token=settings.huggingface_api_key)


async def _make_hf_request(
    prompt: str,
    model: str = "meta-llama/Meta-Llama-3-8B-Instruct",
) -> str:
    """Make request to Hugging Face Inference API."""
    client = get_client()

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": f"Generate a website for: {prompt}"},
    ]

    response = await client.chat_completion(
        model=model,
        messages=messages,
        max_tokens=2000,
        temperature=0.7,
    )

    content = response.choices[0].message.content

    if not content or not content.strip():
        raise ValueError("Hugging Face returned empty response")

    logger.info(
        "hf request completed",
        extra={
            "model": model,
            "tokens": response.usage.total_tokens if response.usage else "unknown",
        },
    )

    return content


async def generate_website_json(
    prompt: str,
    *,
    max_prompt_length: int = 2000,
    model: str = "meta-llama/Meta-Llama-3-8B-Instruct",
) -> str:
    """
    Generate website JSON from a text prompt using Hugging Face.

    Available free models:
    - meta-llama/Meta-Llama-3-8B-Instruct  (recommended)
    - HuggingFaceH4/zephyr-7b-beta
    - microsoft/Phi-3-mini-4k-instruct
    - Qwen/Qwen2.5-7B-Instruct
    """
    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty")

    prompt = prompt.strip()
    if len(prompt) > max_prompt_length:
        raise ValueError(f"Prompt too long ({len(prompt)} > {max_prompt_length})")

    logger.info("generating website", extra={"prompt_preview": prompt[:100], "model": model})

    try:
        content = await _make_hf_request(prompt, model=model)

    except ValueError:
        raise

    except Exception as e:
        error_str = str(e).lower()

        if "rate limit" in error_str or "429" in error_str:
            raise RuntimeError("Rate limit exceeded, try again later") from e
        if "unauthorized" in error_str or "401" in error_str:
            raise RuntimeError("Invalid Hugging Face API key") from e
        if "timeout" in error_str:
            raise TimeoutError("Generation timed out") from e
        if "model is currently loading" in error_str:
            raise RuntimeError("Model is loading, please wait 20 seconds and try again") from e
        if "connection" in error_str:
            raise ConnectionError("Network error reaching Hugging Face") from e

        logger.error("unexpected error", exc_info=True)
        raise RuntimeError("Generation failed unexpectedly") from e

    content = _extract_json(content)

    try:
        parsed = json.loads(content)
        required_keys = {"navbar", "hero", "features", "footer"}
        missing = required_keys - set(parsed.keys())
        if missing:
            logger.warning("missing required keys: %s", missing)
        optional_present = {"seo", "gallery", "contact"} & set(parsed.keys())
        logger.info("optional sections present: %s", optional_present)
    except json.JSONDecodeError:
        logger.error("invalid json returned", extra={"content_preview": content[:200]})

    return content


def _extract_json(text: str) -> str:
    """Extract JSON from model output that may contain extra text."""
    text = text.strip()
    text = re.sub(r"```(?:json)?\s*|\s*```", "", text).strip()

    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1 and end > start:
        return text[start:end + 1]

    return text


async def validate_json_structure(json_str: str) -> tuple[bool, Optional[str]]:
    """Validate generated JSON structure."""
    try:
        data = json.loads(json_str)

        if not isinstance(data.get("navbar"), dict):
            return False, "navbar missing or invalid"
        if not isinstance(data.get("hero"), dict):
            return False, "hero missing or invalid"
        if not isinstance(data.get("features"), list):
            return False, "features missing or invalid"
        if not isinstance(data.get("footer"), dict):
            return False, "footer missing or invalid"

        if "seo" in data and not isinstance(data["seo"], dict):
            return False, "seo must be an object"
        if "gallery" in data and not isinstance(data["gallery"], list):
            return False, "gallery must be a list"
        if "contact" in data and not isinstance(data["contact"], dict):
            return False, "contact must be an object"

        return True, None

    except json.JSONDecodeError as e:
        return False, f"Invalid JSON: {e}"
    except Exception as e:
        return False, f"Validation error: {e}"