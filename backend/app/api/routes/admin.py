"""
Admin routes — monitoring, user management.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.submission import Submission
from app.models.skill import SkillPassport

router = APIRouter()


def require_admin(current_user: dict):
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")


@router.get("/stats")
async def get_platform_stats(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get platform-wide statistics."""
    require_admin(current_user)

    users_count = await db.execute(select(func.count(User.id)))
    submissions_count = await db.execute(select(func.count(Submission.id)))
    passports_count = await db.execute(select(func.count(SkillPassport.id)))

    return {
        "total_users": users_count.scalar(),
        "total_submissions": submissions_count.scalar(),
        "total_passports": passports_count.scalar(),
    }


@router.get("/users")
async def list_users(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List all users (admin only)."""
    require_admin(current_user)
    result = await db.execute(select(User).order_by(User.created_at.desc()).limit(100))
    users = result.scalars().all()
    return [{"id": str(u.id), "email": u.email, "role": u.role.value, "name": u.full_name} for u in users]
