"""
Evaluation result model — AI-scored code evaluations.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import Integer, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class EvaluationResult(Base):
    __tablename__ = "evaluation_results"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    submission_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("submissions.id"), unique=True, nullable=False
    )

    # Scores (0-100 each)
    correctness_score: Mapped[int] = mapped_column(Integer, default=0)
    code_quality_score: Mapped[int] = mapped_column(Integer, default=0)
    efficiency_score: Mapped[int] = mapped_column(Integer, default=0)
    error_handling_score: Mapped[int] = mapped_column(Integer, default=0)
    structure_score: Mapped[int] = mapped_column(Integer, default=0)
    readability_score: Mapped[int] = mapped_column(Integer, default=0)

    # Weighted total
    total_score: Mapped[float] = mapped_column(Float, default=0.0)

    # AI feedback
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    detailed_breakdown: Mapped[dict | None] = mapped_column(JSON, nullable=True)

    # Cost tracking
    tokens_used: Mapped[int | None] = mapped_column(Integer, nullable=True)
    eval_cost_usd: Mapped[float | None] = mapped_column(Float, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    # Relationships
    submission = relationship("Submission", back_populates="evaluation")

    def __repr__(self):
        return f"<EvaluationResult {self.total_score}/100>"
