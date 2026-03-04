"""
ISIN — India's Skill Intelligence Network
FastAPI Backend Application Entry Point
"""
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base
from app.core.logging import setup_logging, get_logger
from app.middleware import RequestLoggingMiddleware
from app.api.routes import auth, tasks, submissions, passports, recruiter, admin

# Initialize logging
setup_logging()
logger = get_logger("app")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("starting_up", environment=settings.ENVIRONMENT)
    # Startup: create tables (dev only — use Alembic in prod)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("database_ready")
    yield
    # Shutdown: dispose engine
    await engine.dispose()
    logger.info("shutdown_complete")


app = FastAPI(
    title="ISIN API",
    description="India's Skill Intelligence Network — AI-Verified Skill Passports",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# Middleware (order matters — outermost first)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

_start_time = time.time()


# Health check
@app.get("/api/health", tags=["health"])
async def health_check():
    return {
        "status": "healthy",
        "service": "isin-api",
        "version": "0.1.0",
        "environment": settings.ENVIRONMENT,
        "uptime_seconds": round(time.time() - _start_time, 1),
    }


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["submissions"])
app.include_router(passports.router, prefix="/api/passports", tags=["passports"])
app.include_router(recruiter.router, prefix="/api/recruiter", tags=["recruiter"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
