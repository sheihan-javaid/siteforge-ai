import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from prometheus_fastapi_instrumentator import Instrumentator
import structlog

from app.routes.generate import router as generate_router
from app.routes.export import router as export_router
from app.routes.health import router as health_router
from app.routes.templates import router as templates_router
from app.routes.projects import router as projects_router
from app.core.config import get_settings
from app.core.database import init_db, close_db

logger = structlog.get_logger()
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("starting up", env=get_settings().environment)
    await init_db()
    yield
    await close_db()
    logger.info("shutting down")


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="SiteForge API",
        description="Generate websites with AI",
        version="0.1.0",
        docs_url="/docs" if not settings.is_prod else None,
        redoc_url="/redoc" if not settings.is_prod else None,
        lifespan=lifespan,
    )

    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    if settings.is_prod:
        prod_origins = ["https://app.siteforge.ai", "https://siteforge.ai"]
        assert "*" not in prod_origins, (
            "Wildcard origin is incompatible with allow_credentials=True"
        )
        app.add_middleware(
            CORSMiddleware,
            allow_origins=prod_origins,
            allow_credentials=True,
            allow_methods=["GET", "POST", "PUT", "DELETE"],
            allow_headers=["Authorization", "Content-Type"],
        )
    else:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["*"],
            allow_credentials=False,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    if settings.is_prod:
        Instrumentator().instrument(app).expose(
            app,
            endpoint="/metrics",
            include_in_schema=False,
        )

    app.include_router(generate_router, prefix="/v1/generate")
    app.include_router(health_router, prefix="/v1/health")
    app.include_router(templates_router, prefix="/v1/templates")
    app.include_router(export_router, prefix="/v1/export")
    app.include_router(projects_router, prefix="/v1/projects")

    @app.get("/")
    def root():
        return {"name": "SiteForge AI", "status": "running", "version": app.version}

    @app.get("/{full_path:path}")
    def not_found(full_path: str):
        raise HTTPException(status_code=404, detail=f"Path '{full_path}' not found")

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn

    settings = get_settings()

    if settings.is_prod:
        raise RuntimeError(
            "Do not run main.py directly in production. "
            "Use: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker"
        )

    port = int(os.getenv("PORT", "8000"))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True, workers=1)