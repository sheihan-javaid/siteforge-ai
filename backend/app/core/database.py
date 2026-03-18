from __future__ import annotations

import logging
from typing import Optional

import certifi
import motor.motor_asyncio
from pymongo.errors import ConnectionFailure, ServerSelectionTimeoutError

from app.core.config import get_settings

logger = logging.getLogger(__name__)

_client: Optional[motor.motor_asyncio.AsyncIOMotorClient] = None
_db: Optional[motor.motor_asyncio.AsyncIOMotorDatabase] = None


def get_db() -> Optional[motor.motor_asyncio.AsyncIOMotorDatabase]:
    return _db


def get_client() -> Optional[motor.motor_asyncio.AsyncIOMotorClient]:
    return _client


async def init_db() -> None:
    global _client, _db

    settings = get_settings()

    if not settings.mongodb_url:
        logger.warning("MONGODB_URL not set — database features disabled")
        return

    try:
        logger.info("connecting to MongoDB", extra={"db": settings.mongodb_db_name})

        _client = motor.motor_asyncio.AsyncIOMotorClient(
            settings.mongodb_url,
            serverSelectionTimeoutMS=5000,
            tlsCAFile=certifi.where(),
            tlsAllowInvalidCertificates=True,
        )

        await _client.admin.command("ping")

        _db = _client[settings.mongodb_db_name]

        await _create_indexes()

        logger.info("MongoDB connected successfully", extra={"db": settings.mongodb_db_name})

    except (ConnectionFailure, ServerSelectionTimeoutError) as e:
        logger.error("MongoDB connection failed — continuing without DB", exc_info=True)
        _client = None
        _db = None


async def close_db() -> None:
    global _client, _db

    if _client:
        _client.close()
        _client = None
        _db = None
        logger.info("MongoDB connection closed")


async def _create_indexes() -> None:
    if _db is None:
        return
    await _db.projects.create_index("created_at")
    await _db.projects.create_index("prompt")
    logger.info("database indexes created")