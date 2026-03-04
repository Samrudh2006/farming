"""
Recruiter routes — search and shortlist candidates.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.skill import SkillPassport
from app.schemas.schemas import RecruiterSearchQuery, CandidateSearchResult

router = APIRouter()


@router.post("/search", response_model=list[CandidateSearchResult])
async def search_candidates(
    query: RecruiterSearchQuery,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Search candidates by skill score and trust level."""
    if current_user["role"] not in ("recruiter", "admin"):
        raise HTTPException(status_code=403, detail="Recruiter access required")

    stmt = (
        select(SkillPassport)
        .where(SkillPassport.overall_score >= query.min_score)
        .where(SkillPassport.overall_score <= query.max_score)
        .where(SkillPassport.trust_score >= query.min_trust)
        .order_by(SkillPassport.overall_score.desc())
        .offset(query.offset)
        .limit(query.limit)
    )

    result = await db.execute(stmt)
    passports = result.scalars().all()

    return [
        CandidateSearchResult(
            passport_id=p.passport_id,
            overall_score=p.overall_score,
            trust_score=p.trust_score,
            skills=p.skill_breakdown,
            tasks_completed=p.total_tasks_completed,
        )
        for p in passports
    ]
