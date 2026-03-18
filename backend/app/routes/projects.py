from __future__ import annotations

import logging
from datetime import datetime, timezone
from typing import Any

from bson import ObjectId
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.database import get_db

logger = logging.getLogger(__name__)
router = APIRouter()


def serialize_project(project: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    project["id"] = str(project.pop("_id"))
    return project


class SaveProjectRequest(BaseModel):
    prompt: str
    website: dict[str, Any]


class ProjectResponse(BaseModel):
    id: str
    prompt: str
    website: dict[str, Any]
    created_at: str
    updated_at: str


@router.post("/", status_code=201)
async def save_project(req: SaveProjectRequest) -> dict:
    """Save a generated website project."""
    try:
        db = get_db()
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Database unavailable")

    now = datetime.now(timezone.utc).isoformat()

    doc = {
        "prompt": req.prompt,
        "website": req.website,
        "created_at": now,
        "updated_at": now,
    }

    result = await db.projects.insert_one(doc)
    logger.info("project saved", extra={"id": str(result.inserted_id)})

    return {"id": str(result.inserted_id), "message": "Project saved successfully"}


@router.get("/")
async def list_projects() -> list[dict]:
    """List all saved projects."""
    try:
        db = get_db()
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Database unavailable")

    cursor = db.projects.find().sort("created_at", -1).limit(50)
    projects = await cursor.to_list(length=50)

    return [serialize_project(p) for p in projects]


@router.get("/{project_id}")
async def get_project(project_id: str) -> dict:
    """Get a single project by ID."""
    try:
        db = get_db()
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Database unavailable")

    try:
        oid = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")

    project = await db.projects.find_one({"_id": oid})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return serialize_project(project)


@router.delete("/{project_id}", status_code=204)
async def delete_project(project_id: str) -> None:
    """Delete a project by ID."""
    try:
        db = get_db()
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Database unavailable")

    try:
        oid = ObjectId(project_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid project ID")

    result = await db.projects.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")

    logger.info("project deleted", extra={"id": project_id})