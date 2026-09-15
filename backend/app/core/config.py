import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    APP_NAME: str = "Pramaan AI"
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_PORT: int = 8000
    APP_HOST: str = "0.0.0.0"

    # Gemini Config
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL_QUESTION: str = "gemini-2.5-flash"
    GEMINI_MODEL_EVALUATE: str = "gemini-2.5-flash"
    GEMINI_MODEL_SUMMARY: str = "gemini-2.5-flash"
    GEMINI_TEMPERATURE_QUESTION: float = 0.4
    GEMINI_TEMPERATURE_EVALUATE: float = 0.2

    # Database
    DATABASE_URL: str = "sqlite:///./pramaan.db"

    # Repository Processing
    REPO_CLONE_DIR: str = "./tmp/repos"
    REPO_MAX_COMMITS: int = 1000
    REPO_MAX_FILE_SIZE_KB: int = 500
    REPO_CLONE_TIMEOUT_SECONDS: int = 60

    # Anomaly Thresholds
    BIG_BANG_THRESHOLD_LINES: int = 1500
    BIG_BANG_THRESHOLD_COMMITS: int = 3
    GHOST_CONTRIBUTOR_DOC_RATIO: float = 0.80
    PANIC_BURST_WINDOW_HOURS: int = 8

    # CORS
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore"
    )

settings = Settings()
