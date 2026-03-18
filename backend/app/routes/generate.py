from __future__ import annotations

import json
import logging
from datetime import datetime, timezone
from typing import Annotated, Any, Optional

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, Field
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.services.llm_service import generate_website_json, _make_hf_request, _extract_json
from app.services.template_service import enhance_template
from app.utils.parser import parse_llm_json
from app.utils.validator import validate_website
from app.core.database import get_db

logger = logging.getLogger(__name__)
limiter = Limiter(key_func=get_remote_address)
router = APIRouter()


class PromptRequest(BaseModel):
    prompt: Annotated[str, Field(min_length=10, max_length=2000)]


class RegenerateRequest(BaseModel):
    prompt: Annotated[str, Field(min_length=10, max_length=2000)]
    section: str
    current_website: dict[str, Any]


class WebsiteResponse(BaseModel):
    seo: Optional[dict] = None
    navbar: dict
    hero: dict
    features: list[dict]
    gallery: Optional[list[dict]] = []
    contact: Optional[dict] = None
    footer: dict


class GenerateResponse(BaseModel):
    status: str
    data: WebsiteResponse


SECTION_PROMPTS: dict[str, str] = {
    "hero": """Regenerate ONLY the hero section as JSON. Return ONLY this structure, nothing else:
{
  "hero": {
    "title": "string",
    "subtitle": "string",
    "cta": "string"
  }
}""",
    "features": """Regenerate ONLY the features section as JSON. Return ONLY this structure, nothing else:
{
  "features": [
    {"title": "string", "description": "string", "icon": "emoji"},
    {"title": "string", "description": "string", "icon": "emoji"}
  ]
}""",
    "navbar": """Regenerate ONLY the navbar section as JSON. Return ONLY this structure, nothing else:
{
  "navbar": {
    "logo": "string",
    "links": ["string", "string", "string"]
  }
}""",
    "gallery": """Regenerate ONLY the gallery section as JSON using https://picsum.photos/seed/{word}/600/400 URLs. Return ONLY this structure, nothing else:
{
  "gallery": [
    {"url": "https://picsum.photos/seed/word/600/400", "alt": "string", "caption": "string"},
    {"url": "https://picsum.photos/seed/word/600/400", "alt": "string", "caption": "string"},
    {"url": "https://picsum.photos/seed/word/600/400", "alt": "string", "caption": "string"}
  ]
}""",
    "contact": """Regenerate ONLY the contact form section as JSON. Return ONLY this structure, nothing else:
{
  "contact": {
    "title": "string",
    "subtitle": "string",
    "fields": [
      {"label": "string", "type": "text", "placeholder": "string"},
      {"label": "string", "type": "email", "placeholder": "string"},
      {"label": "string", "type": "textarea", "placeholder": "string"}
    ],
    "submit_label": "string"
  }
}""",
    "footer": """Regenerate ONLY the footer section as JSON. Return ONLY this structure, nothing else:
{
  "footer": {
    "text": "string",
    "social": ["twitter", "github", "linkedin"]
  }
}""",
    "seo": """Regenerate ONLY the SEO section as JSON. Return ONLY this structure, nothing else:
{
  "seo": {
    "title": "string under 60 chars",
    "description": "string under 160 chars",
    "keywords": ["keyword1", "keyword2", "keyword3"],
    "og_title": "string",
    "og_description": "string"
  }
}""",
}


@router.post("/generate", response_model=GenerateResponse, status_code=200)
@limiter.limit("10/minute")
async def generate_site(request: Request, req: PromptRequest) -> GenerateResponse:
    logger.info("generate request received", extra={"prompt_length": len(req.prompt)})

    if not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Prompt cannot be empty")

    try:
        raw = await generate_website_json(req.prompt)
    except TimeoutError as e:
        raise HTTPException(status_code=504, detail="Website generation timed out") from e
    except ConnectionError as e:
        raise HTTPException(status_code=502, detail="Upstream AI service unavailable") from e
    except RuntimeError as e:
        if "loading" in str(e).lower():
            raise HTTPException(status_code=503, detail=str(e)) from e
        raise HTTPException(status_code=502, detail=str(e)) from e

    try:
        parsed = parse_llm_json(raw)
    except ValueError as e:
        logger.warning("llm returned unparseable json", extra={"error": str(e)})
        raise HTTPException(status_code=502, detail="AI returned malformed JSON") from e

    try:
        enhanced = enhance_template(parsed)
        validated = validate_website(enhanced)
    except (TypeError, ValueError) as e:
        logger.warning("website validation failed", extra={"error": str(e)})
        raise HTTPException(status_code=422, detail=str(e)) from e

    website_data = validated.model_dump()

    # Auto-save to MongoDB
    try:
        db = get_db()
        now = datetime.now(timezone.utc).isoformat()
        await db.projects.insert_one({
            "prompt": req.prompt,
            "website": website_data,
            "created_at": now,
            "updated_at": now,
        })
        logger.info("project auto-saved to MongoDB")
    except Exception:
        logger.warning("auto-save failed — continuing without saving")

    logger.info("generate request completed successfully", extra={"status": "success"})

    return GenerateResponse(status="success", data=website_data)


@router.post("/regenerate", status_code=200)
@limiter.limit("20/minute")
async def regenerate_section(request: Request, req: RegenerateRequest) -> dict:
    if req.section not in SECTION_PROMPTS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid section. Must be one of: {', '.join(SECTION_PROMPTS.keys())}",
        )

    logger.info(
        "regenerate request received",
        extra={"section": req.section, "prompt_length": len(req.prompt)},
    )

    full_prompt = (
        f"Website description: {req.prompt}\n\n"
        f"{SECTION_PROMPTS[req.section]}\n\n"
        "Make the content different from before but still relevant to the website description."
    )

    try:
        raw = await _make_hf_request(full_prompt)
        content = _extract_json(raw)
        parsed = json.loads(content)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail="AI returned malformed JSON") from e
    except TimeoutError as e:
        raise HTTPException(status_code=504, detail="Regeneration timed out") from e
    except RuntimeError as e:
        if "loading" in str(e).lower():
            raise HTTPException(status_code=503, detail=str(e)) from e
        raise HTTPException(status_code=502, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e)) from e

    if req.section not in parsed:
        raise HTTPException(
            status_code=502,
            detail=f"AI did not return the requested section: {req.section}",
        )

    updated_website = {**req.current_website, req.section: parsed[req.section]}

    logger.info("section regenerated successfully", extra={"section": req.section})

    return {"status": "success", "section": req.section, "data": updated_website}