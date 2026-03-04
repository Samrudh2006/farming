"""
Pydantic schemas for request/response validation.
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


# ─── Auth ─────────────────────────────────────────────
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str = Field(..., min_length=2, max_length=255)
    role: str = "candidate"
    college: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserProfile"


class UserProfile(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: str
    college: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}


# ─── Tasks ────────────────────────────────────────────
class TaskOut(BaseModel):
    id: UUID
    title: str
    description: str
    task_type: str
    difficulty: str
    language: str
    time_limit_minutes: int
    starter_code: Optional[str] = None
    max_score: int
    created_at: datetime

    model_config = {"from_attributes": True}


class TaskCreate(BaseModel):
    title: str
    description: str
    task_type: str
    difficulty: str
    language: str = "python"
    time_limit_minutes: int = 45
    starter_code: Optional[str] = None
    test_cases: Optional[dict] = None
    evaluation_rubric: Optional[dict] = None


# ─── Submissions ──────────────────────────────────────
class SubmissionCreate(BaseModel):
    task_id: UUID
    code: str
    language: str = "python"


class SubmissionOut(BaseModel):
    id: UUID
    task_id: UUID
    status: str
    submitted_at: datetime
    completed_at: Optional[datetime] = None
    execution_time_ms: Optional[int] = None

    model_config = {"from_attributes": True}


# ─── Evaluations ─────────────────────────────────────
class EvaluationOut(BaseModel):
    correctness_score: int
    code_quality_score: int
    efficiency_score: int
    error_handling_score: int
    structure_score: int
    readability_score: int
    total_score: float
    feedback: Optional[str] = None

    model_config = {"from_attributes": True}


class SubmissionWithEval(SubmissionOut):
    evaluation: Optional[EvaluationOut] = None


# ─── Skill Passport ──────────────────────────────────
class SkillScoreOut(BaseModel):
    skill_name: str
    score: float
    tasks_completed: int
    confidence_level: float

    model_config = {"from_attributes": True}


class PassportOut(BaseModel):
    passport_id: str
    overall_score: float
    skill_breakdown: Optional[dict] = None
    total_tasks_completed: int
    is_verified: bool
    trust_score: float
    created_at: datetime
    user: UserProfile

    model_config = {"from_attributes": True}


# ─── Recruiter Search ────────────────────────────────
class RecruiterSearchQuery(BaseModel):
    min_score: Optional[float] = 0
    max_score: Optional[float] = 100
    skills: Optional[List[str]] = None
    min_trust: Optional[float] = 60
    limit: int = Field(default=20, le=100)
    offset: int = 0


class CandidateSearchResult(BaseModel):
    passport_id: str
    overall_score: float
    trust_score: float
    skills: Optional[dict] = None
    tasks_completed: int


# ─── Behavior Events ─────────────────────────────────
class BehaviorEventCreate(BaseModel):
    submission_id: Optional[UUID] = None
    event_type: str
    event_data: Optional[dict] = None


# ─── Generic ─────────────────────────────────────────
class MessageResponse(BaseModel):
    message: str
    success: bool = True


class PaginatedResponse(BaseModel):
    items: List
    total: int
    limit: int
    offset: int
