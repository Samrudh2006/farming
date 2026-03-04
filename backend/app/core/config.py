"""
Application configuration from environment variables.
"""
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # App
    APP_NAME: str = "ISIN API"
    DEBUG: bool = False
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/isin_db"

    # Auth / JWT
    SECRET_KEY: str = "change-this-in-production-use-openssl-rand-hex-32"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4o-mini"
    OPENAI_MAX_TOKENS: int = 2000

    # Judge0 Code Sandbox
    JUDGE0_URL: str = "http://localhost:2358"
    JUDGE0_API_KEY: str = ""

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://isin.vercel.app",
    ]

    # Rate Limits
    RATE_LIMIT_PER_MINUTE: int = 60

    # Cost Guardrails
    MAX_OPENAI_COST_PER_DAY_USD: float = 5.0
    MAX_SUBMISSIONS_PER_USER_PER_DAY: int = 10

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
    }


settings = Settings()
