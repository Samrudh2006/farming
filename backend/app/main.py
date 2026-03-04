"""
ISIN — India's Skill Intelligence Network
FastAPI Backend Application Entry Point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import engine, Base
from app.api.routes import auth, tasks, submissions, passports, recruiter, admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup: create tables (dev only — use Alembic in prod)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown: dispose engine
    await engine.dispose()


app = FastAPI(
    title="ISIN API",
    description="India's Skill Intelligence Network — AI-Verified Skill Passports",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check
@app.get("/api/health", tags=["health"])
async def health_check():
    return {"status": "healthy", "service": "isin-api", "version": "0.1.0"}


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(submissions.router, prefix="/api/submissions", tags=["submissions"])
app.include_router(passports.router, prefix="/api/passports", tags=["passports"])
app.include_router(recruiter.router, prefix="/api/recruiter", tags=["recruiter"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
