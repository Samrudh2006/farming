"""
Skill score and Skill Passport models.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Integer, Float, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class SkillScore(Base):
    __tablename__ = "skill_scores"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    skill_name: Mapped[str] = mapped_column(String(100), nullable=False)
    score: Mapped[float] = mapped_column(Float, default=0.0)
    tasks_completed: Mapped[int] = mapped_column(Integer, default=0)
    confidence_level: Mapped[float] = mapped_column(Float, default=0.0)
    score_history: Mapped[dict | None] = mapped_column(JSON, nullable=True)  # [{date, score}]
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def __repr__(self):
        return f"<SkillScore {self.skill_name}: {self.score}>"


class SkillPassport(Base):
    __tablename__ = "skill_passports"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False
    )
    passport_id: Mapped[str] = mapped_column(
        String(20), unique=True, nullable=False, index=True
    )  # e.g. "ISIN-2026-0042"
    overall_score: Mapped[float] = mapped_column(Float, default=0.0)
    skill_breakdown: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    total_tasks_completed: Mapped[int] = mapped_column(Integer, default=0)
    is_verified: Mapped[bool] = mapped_column(Boolean, default=False)
    trust_score: Mapped[float] = mapped_column(Float, default=100.0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    user = relationship("User", back_populates="skill_passport")

    def __repr__(self):
        return f"<SkillPassport {self.passport_id} score={self.overall_score}>"
