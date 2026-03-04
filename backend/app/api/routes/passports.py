"""
Passport routes — view and share Skill Passports.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.skill import SkillPassport, SkillScore
from app.schemas.schemas import PassportOut, SkillScoreOut

router = APIRouter()


@router.get("/me", response_model=PassportOut)
async def get_my_passport(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get current user's Skill Passport."""
    result = await db.execute(
        select(SkillPassport).where(SkillPassport.user_id == current_user["user_id"])
    )
    passport = result.scalar_one_or_none()
    if not passport:
        raise HTTPException(status_code=404, detail="No Skill Passport found. Complete tasks to build one.")
    return PassportOut.model_validate(passport)


@router.get("/{passport_id}", response_model=PassportOut)
async def get_passport_public(
    passport_id: str,
    db: AsyncSession = Depends(get_db),
):
    """Get a Skill Passport by public ID (no auth required — for sharing)."""
    result = await db.execute(
        select(SkillPassport).where(SkillPassport.passport_id == passport_id)
    )
    passport = result.scalar_one_or_none()
    if not passport:
        raise HTTPException(status_code=404, detail="Passport not found")
    return PassportOut.model_validate(passport)


@router.get("/me/skills", response_model=list[SkillScoreOut])
async def get_my_skills(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get all skill scores for the current user."""
    result = await db.execute(
        select(SkillScore).where(SkillScore.user_id == current_user["user_id"])
    )
    return [SkillScoreOut.model_validate(s) for s in result.scalars().all()]
