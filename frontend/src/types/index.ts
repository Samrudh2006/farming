/**
 * TypeScript type definitions for the ISIN platform.
 */

// ─── User Types ──────────────────────────────────────
export type UserRole = "candidate" | "recruiter" | "admin";

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  college?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ─── Task Types ──────────────────────────────────────
export type TaskDifficulty = "easy" | "medium" | "hard";
export type TaskType = "api" | "data_processing" | "debugging" | "algorithm" | "code_review";

export interface Task {
  id: string;
  title: string;
  description: string;
  task_type: TaskType;
  difficulty: TaskDifficulty;
  language: string;
  time_limit_minutes: number;
  starter_code?: string;
  max_score: number;
  created_at: string;
}

// ─── Submission Types ────────────────────────────────
export type SubmissionStatus = "pending" | "running" | "evaluating" | "completed" | "failed";

export interface Submission {
  id: string;
  task_id: string;
  status: SubmissionStatus;
  submitted_at: string;
  completed_at?: string;
  execution_time_ms?: number;
  evaluation?: Evaluation;
}

// ─── Evaluation Types ────────────────────────────────
export interface Evaluation {
  correctness_score: number;
  code_quality_score: number;
  efficiency_score: number;
  error_handling_score: number;
  structure_score: number;
  readability_score: number;
  total_score: number;
  feedback?: string;
}

export interface EvaluationDimension {
  key: keyof Omit<Evaluation, "total_score" | "feedback">;
  label: string;
  color: string;
}

export const EVALUATION_DIMENSIONS: EvaluationDimension[] = [
  { key: "correctness_score", label: "Correctness", color: "#4F46E5" },
  { key: "code_quality_score", label: "Code Quality", color: "#6366F1" },
  { key: "efficiency_score", label: "Efficiency", color: "#7C3AED" },
  { key: "error_handling_score", label: "Error Handling", color: "#A78BFA" },
  { key: "structure_score", label: "Structure", color: "#C084FC" },
  { key: "readability_score", label: "Readability", color: "#EC4899" },
];

// ─── Skill / Passport Types ─────────────────────────
export interface SkillScore {
  skill_name: string;
  score: number;
  tasks_completed: number;
  confidence_level: number;
}

export interface SkillPassport {
  passport_id: string;
  overall_score: number;
  skill_breakdown?: Record<string, number>;
  total_tasks_completed: number;
  is_verified: boolean;
  trust_score: number;
  created_at: string;
  user: User;
}

// ─── Recruiter Types ────────────────────────────────
export interface CandidateResult {
  passport_id: string;
  overall_score: number;
  trust_score: number;
  skills?: Record<string, number>;
  tasks_completed: number;
}

export interface SearchQuery {
  min_score?: number;
  max_score?: number;
  skills?: string[];
  min_trust?: number;
  limit?: number;
  offset?: number;
}

// ─── Behavior / Anti-Cheat ──────────────────────────
export type BehaviorEventType =
  | "paste_detected"
  | "tab_switch"
  | "typing_pattern"
  | "code_similarity"
  | "timeline_anomaly";

export interface BehaviorEvent {
  event_type: BehaviorEventType;
  event_data?: Record<string, unknown>;
  timestamp: string;
}

// ─── UI Types ────────────────────────────────────────
export type TrustLevel = "high" | "medium" | "low";
export type SkillLevel = "expert" | "advanced" | "intermediate" | "developing" | "beginner";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}
