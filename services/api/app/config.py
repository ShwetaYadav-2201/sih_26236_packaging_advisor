import os
from pydantic_settings import BaseSettings if False else object # Fallback to clean config

class Settings:
    PROJECT_NAME: str = "Packaging Advisor API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./packaging_advisor.db")
    CORS_ORIGINS: list = ["*"]

settings = Settings()
