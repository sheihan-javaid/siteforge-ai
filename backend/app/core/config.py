from functools import lru_cache
from typing import Optional

from pydantic import field_validator, model_validator
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    environment: str = "development"
    database_url: str = "sqlite:///./dev.db"
    mongodb_url: Optional[str] = None              # ← MongoDB connection string
    mongodb_db_name: str = "siteforge"             # ← Database name
    openai_api_key: Optional[str] = None
    huggingface_api_key: Optional[str] = None
    redis_url: Optional[str] = None

    # Feature flags
    enable_image_gen: bool = False
    max_concurrent_jobs: int = 5

    @property
    def is_prod(self) -> bool:
        return self.environment == "production"

    @property
    def is_mongodb(self) -> bool:
        return self.mongodb_url is not None

    @field_validator("database_url")
    @classmethod
    def validate_db_url(cls, v: str) -> str:
        if not v:
            raise ValueError("database_url cannot be empty")

        valid_schemes = ("sqlite", "postgresql", "postgres", "mysql", "mongodb")
        if not any(v.startswith(scheme) for scheme in valid_schemes):
            raise ValueError(f"database_url must start with one of: {', '.join(valid_schemes)}")

        return v

    @model_validator(mode="after")
    def validate_production_constraints(self) -> "Settings":
        if self.environment == "production":
            if self.database_url.startswith("sqlite") and not self.mongodb_url:
                raise ValueError("SQLite is not allowed in production - use MongoDB or PostgreSQL")

            if not self.openai_api_key and not self.huggingface_api_key:
                raise ValueError("Either OPENAI_API_KEY or HUGGINGFACE_API_KEY must be set in production")

            if self.max_concurrent_jobs > 20:
                raise ValueError("max_concurrent_jobs cannot exceed 20 in production")

        return self

    @model_validator(mode="after")
    def validate_development_defaults(self) -> "Settings":
        if self.environment == "development":
            if self.max_concurrent_jobs > 10:
                self.max_concurrent_jobs = 10

        return self

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False
        extra = "ignore"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


def reload_settings() -> None:
    get_settings.cache_clear()