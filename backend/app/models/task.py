"""
Task model — AI-generated coding challenges.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Text, Integer, DateTime, Enum as SAEnum, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import enum

from app.core.database import Base


class TaskDifficulty(str, enum.Enum):
    EASY = "easy"
    MEDIUM = "medium"
    HARD = "hard"


class TaskType(str, enum.Enum):
    API = "api"
    DATA_PROCESSING = "data_processing"
    DEBUGGING = "debugging"
    ALGORITHM = "algorithm"
    CODE_REVIEW = "code_review"


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    task_type: Mapped[TaskType] = mapped_column(SAEnum(TaskType), nullable=False)
    difficulty: Mapped[TaskDifficulty] = mapped_column(SAEnum(TaskDifficulty), nullable=False)
    language: Mapped[str] = mapped_column(String(50), default="python")
    time_limit_minutes: Mapped[int] = mapped_column(Integer, default=45)
    starter_code: Mapped[str | None] = mapped_column(Text, nullable=True)
    test_cases: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    evaluation_rubric: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    max_score: Mapped[int] = mapped_column(Integer, default=100)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    submissions = relationship("Submission", back_populates="task", lazy="selectin")

    def __repr__(self):
        return f"<Task {self.title} ({self.difficulty})>"
