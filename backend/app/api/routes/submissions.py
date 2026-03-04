"""
Submission routes — submit code, check status.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.submission import Submission
from app.models.task import Task
from app.schemas.schemas import SubmissionCreate, SubmissionOut, SubmissionWithEval

router = APIRouter()


@router.post("/", response_model=SubmissionOut, status_code=201)
async def submit_code(
    data: SubmissionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Submit code for a task."""
    # Verify task exists
    task_result = await db.execute(select(Task).where(Task.id == data.task_id))
    if not task_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Task not found")

    submission = Submission(
        user_id=current_user["user_id"],
        task_id=data.task_id,
        code=data.code,
        language=data.language,
    )
    db.add(submission)
    await db.flush()

    # TODO: Trigger async evaluation pipeline
    return SubmissionOut.model_validate(submission)


@router.get("/{submission_id}", response_model=SubmissionWithEval)
async def get_submission(
    submission_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get submission with evaluation results."""
    result = await db.execute(
        select(Submission).where(Submission.id == submission_id)
    )
    submission = result.scalar_one_or_none()
    if not submission:
        raise HTTPException(status_code=404, detail="Submission not found")
    if str(submission.user_id) != current_user["user_id"] and current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")

    return SubmissionWithEval.model_validate(submission)


@router.get("/", response_model=list[SubmissionOut])
async def list_my_submissions(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List all submissions for the current user."""
    result = await db.execute(
        select(Submission)
        .where(Submission.user_id == current_user["user_id"])
        .order_by(Submission.submitted_at.desc())
    )
    return [SubmissionOut.model_validate(s) for s in result.scalars().all()]
