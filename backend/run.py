import uvicorn
import os

from app.core.config import get_settings

if __name__ == "__main__":
    settings = get_settings()

    if settings.is_prod:
        raise RuntimeError(
            "Do not run run.py directly in production. "
            "Use: gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker"
        )

    uvicorn.run(
        "app.main:app",
        host=os.getenv("HOST", "127.0.0.1"),
        port=int(os.getenv("PORT", "8000")),
        reload=True,
        workers=1,
        log_level="debug",
    )