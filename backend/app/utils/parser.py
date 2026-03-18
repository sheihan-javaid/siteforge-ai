from __future__ import annotations

import json
import logging
import re
from typing import Any

logger = logging.getLogger(__name__)


def parse_llm_json(response: str, *, max_length: int = 100_000) -> dict | list:
    if not response or not response.strip():
        raise ValueError("Empty response from LLM")

    if len(response) > max_length:
        raise ValueError(f"Response exceeds max allowed length ({max_length} chars)")

    cleaned = re.sub(r"```(?:json)?\s*|\s*```", "", response).strip()

    match = re.search(r"(\{[\s\S]*\}|\[[\s\S]*\])", cleaned)
    if not match:
        raise ValueError(f"No JSON object or array found in response: {cleaned!r}")

    try:
        return json.loads(match.group(1))
    except json.JSONDecodeError as e:
        logger.debug("Failed to parse LLM JSON", exc_info=True, raw=cleaned[:500])
        raise ValueError(f"Invalid JSON from LLM: {e}") from e


def parse_llm_json_typed(response: str, expected_type: type[dict | list] = dict, **kwargs: Any) -> dict | list:
    result = parse_llm_json(response, **kwargs)
    if not isinstance(result, expected_type):
        raise TypeError(f"Expected {expected_type.__name__}, got {type(result).__name__}")
    return result