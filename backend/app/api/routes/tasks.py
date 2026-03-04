"""
Task routes — list, get, generate tasks.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from uuid import UUID

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.task import Task
from app.schemas.schemas import TaskOut, TaskCreate

router = APIRouter()


@router.get("/", response_model=list[TaskOut])
async def list_tasks(
    difficulty: Optional[str] = Query(None),
    task_type: Optional[str] = Query(None),
    limit: int = Query(20, le=50),
    offset: int = Query(0),
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_user),
):
    """List available tasks with optional filters."""
    query = select(Task)
    if difficulty:
        query = query.where(Task.difficulty == difficulty)
    if task_type:
        query = query.where(Task.task_type == task_type)
    query = query.offset(offset).limit(limit).order_by(Task.created_at.desc())

    result = await db.execute(query)
    return [TaskOut.model_validate(t) for t in result.scalars().all()]


@router.get("/{task_id}", response_model=TaskOut)
async def get_task(
    task_id: UUID,
    db: AsyncSession = Depends(get_db),
    _: dict = Depends(get_current_user),
):
    """Get a specific task by ID."""
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return TaskOut.model_validate(task)


@router.post("/generate", response_model=TaskOut, status_code=201)
async def generate_task(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Generate a new unique AI task for the user."""
    # TODO: Implement AI task generation via OpenAI
    raise HTTPException(status_code=501, detail="AI task generation coming soon")


@router.post("/", response_model=TaskOut, status_code=201)
async def create_task(
    data: TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create a task manually (admin only)."""
    if current_user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin only")

    task = Task(**data.model_dump())
    db.add(task)
    await db.flush()
    return TaskOut.model_validate(task)
