"""
Behavior tracking and trust score models for anti-cheat.
"""
import uuid
from datetime import datetime, timezone
from sqlalchemy import String, Float, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID

from app.core.database import Base


class BehaviorEvent(Base):
    __tablename__ = "behavior_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True
    )
    submission_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("submissions.id"), nullable=True
    )
    event_type: Mapped[str] = mapped_column(String(50), nullable=False)
    # paste_detected, tab_switch, typing_pattern, code_similarity, timeline_anomaly
    event_data: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    raw_payload: Mapped[str | None] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    def __repr__(self):
        return f"<BehaviorEvent {self.event_type}>"


class TrustScore(Base):
    __tablename__ = "trust_scores"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), unique=True, nullable=False, index=True
    )
    overall_trust: Mapped[float] = mapped_column(Float, default=100.0)
    paste_score: Mapped[float] = mapped_column(Float, default=100.0)
    tab_switch_score: Mapped[float] = mapped_column(Float, default=100.0)
    typing_score: Mapped[float] = mapped_column(Float, default=100.0)
    similarity_score: Mapped[float] = mapped_column(Float, default=100.0)
    timeline_score: Mapped[float] = mapped_column(Float, default=100.0)
    signal_details: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def __repr__(self):
        return f"<TrustScore user={self.user_id} trust={self.overall_trust}>"
