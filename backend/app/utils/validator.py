from __future__ import annotations

import logging
from typing import Any

from pydantic import ValidationError

from app.schemas.website_schema import Website

logger = logging.getLogger(__name__)


def validate_website(data: dict[str, Any]) -> Website:
    if not isinstance(data, dict):
        raise TypeError(f"Expected dict, got {type(data).__name__}")

    try:
        return Website(**data)
    except ValidationError as e:
        logger.debug("Website validation failed", errors=e.errors())
        raise ValueError(e.errors()) from e