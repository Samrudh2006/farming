# Database Schema
## India's Skill Intelligence Network — MVP

**Database:** PostgreSQL 15+  
**ORM:** SQLAlchemy 2.0  
**Migrations:** Alembic

---

## Entity Relationship Diagram (Text)

```
┌──────────────┐     ┌───────────────┐     ┌────────────────┐
│    users      │     │    tasks      │     │  submissions   │
│──────────────│     │───────────────│     │────────────────│
│ id (PK)      │◄───┐│ id (PK)      │◄───┐│ id (PK)       │
│ email        │    ││ user_id (FK) ─┘    ││ task_id (FK) ──┘
│ password_hash│    ││ task_type     │     ││ user_id (FK) ──┐
│ full_name    │    ││ title         │     ││ code           │
│ role         │    ││ problem_stmt  │     ││ language       │
│ ...          │    ││ starter_code  │     ││ status         │
└──────┬───────┘    ││ test_cases   │     ││ submitted_at   │
       │            ││ params_seed  │     │└────────┬───────┘
       │            ││ expires_at   │     │         │
       │            │└───────────────┘     │         │
       │            │                      │         │
       │    ┌───────┘                      │         │
       │    │                              │         │
┌──────┴────┴──┐     ┌───────────────┐     │  ┌──────┴───────────┐
│skill_passports│     │ skill_scores  │     │  │ evaluation_results│
│──────────────│     │───────────────│     │  │─────────────────│
│ id (PK)      │     │ id (PK)      │     │  │ id (PK)         │
│ user_id (FK) │     │ user_id (FK) ─┘     │  │ submission_id(FK)│
│ overall_score│     │ skill_type   │      │  │ correctness     │
│ trust_level  │     │ score        │      │  │ quality_score   │
│ public_slug  │     │ correctness  │      │  │ approach_score  │
│ is_active    │     │ quality      │      │  │ final_score     │
│ generated_at │     │ approach     │      │  │ llm_feedback    │
└──────────────┘     │ evaluated_at │      │  │ test_results    │
                     └───────────────┘      │  └─────────────────┘
                                            │
                     ┌───────────────┐      │  ┌─────────────────┐
                     │behavior_events│      │  │recruiter_actions │
                     │───────────────│      │  │─────────────────│
                     │ id (PK)      │      │  │ id (PK)         │
                     │ submission_id │──────┘  │ recruiter_id(FK)│
                     │ event_type   │         │ candidate_id(FK)│
                     │ event_data   │         │ action_type     │
                     │ timestamp    │         │ created_at      │
                     └───────────────┘         └─────────────────┘
```

---

## Table Definitions

### 1. `users`
The central user table for all roles (candidate, recruiter, admin).

```sql
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255),          -- NULL for OAuth-only users
    full_name       VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL DEFAULT 'candidate'
                    CHECK (role IN ('candidate', 'recruiter', 'admin')),
    
    -- Candidate-specific fields
    phone           VARCHAR(15),
    location_city   VARCHAR(100),
    location_state  VARCHAR(100),
    graduation_year INTEGER,
    college_name    VARCHAR(255),
    linkedin_url    VARCHAR(500),
    github_url      VARCHAR(500),
    
    -- Recruiter-specific fields
    company_name    VARCHAR(255),
    company_size    VARCHAR(50),           -- 'startup', 'mid', 'enterprise'
    designation     VARCHAR(255),
    
    -- Auth
    email_verified  BOOLEAN NOT NULL DEFAULT FALSE,
    oauth_provider  VARCHAR(50),           -- 'google', NULL for email/password
    oauth_id        VARCHAR(255),
    
    -- Meta
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login_at   TIMESTAMP,
    
    -- Indexes
    CONSTRAINT unique_oauth UNIQUE (oauth_provider, oauth_id)
);

CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users(location_state, location_city);
CREATE INDEX idx_users_graduation ON users(graduation_year);
CREATE INDEX idx_users_email ON users(email);
```

### 2. `tasks`
AI-generated coding tasks assigned to specific users.

```sql
CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Task content
    task_type       VARCHAR(30) NOT NULL
                    CHECK (task_type IN ('api_design', 'data_processing', 'debugging')),
    title           VARCHAR(500) NOT NULL,
    problem_statement TEXT NOT NULL,        -- Full problem description (Markdown)
    constraints     JSONB NOT NULL,         -- ["constraint 1", "constraint 2"]
    starter_code    TEXT,                   -- Optional starter code
    
    -- Test cases (hidden from candidate)
    test_cases      JSONB NOT NULL,         -- [{"input": "...", "expected": "...", "description": "..."}]
    evaluation_rubric TEXT,                -- Rubric for LLM evaluation
    
    -- Uniqueness/anti-copy
    params_seed     VARCHAR(255) NOT NULL,  -- Hash used to parameterize task
    generation_prompt TEXT,                 -- The actual LLM prompt used (for debugging)
    
    -- Task lifecycle
    status          VARCHAR(20) NOT NULL DEFAULT 'assigned'
                    CHECK (status IN ('assigned', 'in_progress', 'submitted', 'expired')),
    time_limit_mins INTEGER NOT NULL DEFAULT 45,
    assigned_at     TIMESTAMP NOT NULL DEFAULT NOW(),
    started_at      TIMESTAMP,             -- When candidate opens the task
    expires_at      TIMESTAMP NOT NULL,    -- assigned_at + time_limit
    
    -- Meta
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_user_task_type UNIQUE (user_id, task_type)
);

CREATE INDEX idx_tasks_user ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_type ON tasks(task_type);
```

### 3. `submissions`
Code submitted by candidates for their tasks.

```sql
CREATE TABLE submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Submitted code
    code            TEXT NOT NULL,
    language        VARCHAR(20) NOT NULL DEFAULT 'python',
    
    -- Execution results
    execution_status VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (execution_status IN (
                        'pending', 'running', 'completed', 'error', 'timeout'
                    )),
    execution_time_ms INTEGER,             -- Total execution time
    memory_used_kb  INTEGER,               -- Peak memory usage
    stdout          TEXT,                   -- Standard output
    stderr          TEXT,                   -- Standard error
    
    -- Test results
    test_results    JSONB,                 -- [{"test_id": 1, "passed": true, "output": "...", "time_ms": 50}]
    tests_passed    INTEGER DEFAULT 0,
    tests_total     INTEGER DEFAULT 0,
    
    -- Status
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending', 'evaluating', 'scored', 'failed')),
    
    -- Meta
    submitted_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_user_task_submission UNIQUE (user_id, task_id)
);

CREATE INDEX idx_submissions_user ON submissions(user_id);
CREATE INDEX idx_submissions_task ON submissions(task_id);
CREATE INDEX idx_submissions_status ON submissions(status);
```

### 4. `evaluation_results`
AI evaluation scores for each submission.

```sql
CREATE TABLE evaluation_results (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id   UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE UNIQUE,
    
    -- Score breakdown
    correctness_score   FLOAT NOT NULL CHECK (correctness_score BETWEEN 0 AND 100),
    quality_score       FLOAT NOT NULL CHECK (quality_score BETWEEN 0 AND 100),
    approach_score      FLOAT NOT NULL CHECK (approach_score BETWEEN 0 AND 100),
    final_score         FLOAT NOT NULL CHECK (final_score BETWEEN 0 AND 100),
    
    -- Sub-scores (quality breakdown)
    naming_score        FLOAT CHECK (naming_score BETWEEN 0 AND 100),
    readability_score   FLOAT CHECK (readability_score BETWEEN 0 AND 100),
    error_handling_score FLOAT CHECK (error_handling_score BETWEEN 0 AND 100),
    edge_case_score     FLOAT CHECK (edge_case_score BETWEEN 0 AND 100),
    
    -- LLM feedback
    llm_quality_feedback TEXT,             -- LLM's written feedback on code quality
    llm_approach_feedback TEXT,            -- LLM's written feedback on approach
    llm_model_used      VARCHAR(50),       -- 'gpt-4o-mini', etc.
    llm_prompt_tokens    INTEGER,
    llm_completion_tokens INTEGER,
    
    -- Meta
    evaluated_at    TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_eval_submission ON evaluation_results(submission_id);
CREATE INDEX idx_eval_final_score ON evaluation_results(final_score);
```

### 5. `skill_scores`
Aggregated skill scores per user per skill type.

```sql
CREATE TABLE skill_scores (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Skill identification
    skill_type      VARCHAR(30) NOT NULL
                    CHECK (skill_type IN ('api_design', 'data_processing', 'debugging')),
    
    -- Scores
    score           FLOAT NOT NULL CHECK (score BETWEEN 0 AND 100),
    correctness     FLOAT NOT NULL CHECK (correctness BETWEEN 0 AND 100),
    quality         FLOAT NOT NULL CHECK (quality BETWEEN 0 AND 100),
    approach        FLOAT NOT NULL CHECK (approach BETWEEN 0 AND 100),
    
    -- Skill level derived from score
    skill_level     VARCHAR(20) NOT NULL
                    CHECK (skill_level IN ('beginner', 'developing', 'intermediate', 'advanced', 'expert')),
    
    -- Meta
    evaluated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_user_skill UNIQUE (user_id, skill_type)
);

CREATE INDEX idx_skill_scores_user ON skill_scores(user_id);
CREATE INDEX idx_skill_scores_type ON skill_scores(skill_type);
CREATE INDEX idx_skill_scores_score ON skill_scores(score DESC);
```

### 6. `skill_passports`
The candidate's public Skill Passport profile.

```sql
CREATE TABLE skill_passports (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    
    -- Aggregated scores
    overall_score   FLOAT NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
    api_score       FLOAT CHECK (api_score BETWEEN 0 AND 100),
    data_score      FLOAT CHECK (data_score BETWEEN 0 AND 100),
    debug_score     FLOAT CHECK (debug_score BETWEEN 0 AND 100),
    
    -- Trust/Anti-cheat
    trust_level     VARCHAR(10) NOT NULL DEFAULT 'high'
                    CHECK (trust_level IN ('high', 'medium', 'low')),
    
    -- Public sharing
    public_slug     VARCHAR(100) NOT NULL UNIQUE,  -- e.g., 'priya-sharma-x7k2'
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    is_public       BOOLEAN NOT NULL DEFAULT TRUE,
    
    -- Skill level
    overall_level   VARCHAR(20) NOT NULL
                    CHECK (overall_level IN ('beginner', 'developing', 'intermediate', 'advanced', 'expert')),
    
    -- Meta
    generated_at    TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    view_count      INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_passport_user ON skill_passports(user_id);
CREATE INDEX idx_passport_slug ON skill_passports(public_slug);
CREATE INDEX idx_passport_score ON skill_passports(overall_score DESC);
CREATE INDEX idx_passport_active ON skill_passports(is_active, is_public);
-- Composite index for recruiter search
CREATE INDEX idx_passport_search ON skill_passports(is_active, is_public, overall_score DESC, trust_level);
```

### 7. `behavior_events`
Client-side events tracked for anti-cheat analysis.

```sql
CREATE TABLE behavior_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id   UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    
    -- Event data
    event_type      VARCHAR(30) NOT NULL
                    CHECK (event_type IN (
                        'paste', 'tab_switch', 'window_blur', 'window_focus',
                        'keystroke_burst', 'idle_period', 'code_snapshot'
                    )),
    event_data      JSONB,                 -- {"paste_length": 500, "content_hash": "..."}
    
    -- Timing
    timestamp       TIMESTAMP NOT NULL DEFAULT NOW(),
    session_time_ms BIGINT                 -- Milliseconds since task started
);

CREATE INDEX idx_behavior_submission ON behavior_events(submission_id);
CREATE INDEX idx_behavior_user ON behavior_events(user_id);
CREATE INDEX idx_behavior_type ON behavior_events(event_type);
```

### 8. `trust_scores`
Computed anti-cheat trust score per submission.

```sql
CREATE TABLE trust_scores (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id   UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE UNIQUE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Individual signals
    paste_ratio     FLOAT DEFAULT 0,       -- paste_chars / total_chars
    tab_switches    INTEGER DEFAULT 0,
    idle_bursts     INTEGER DEFAULT 0,     -- Long idle + sudden code burst
    similarity_score FLOAT DEFAULT 0,      -- Max similarity with other submissions
    
    -- Flags
    paste_flag      BOOLEAN DEFAULT FALSE,
    tab_flag        BOOLEAN DEFAULT FALSE,
    burst_flag      BOOLEAN DEFAULT FALSE,
    similarity_flag BOOLEAN DEFAULT FALSE,
    total_flags     INTEGER DEFAULT 0,
    
    -- Final trust level
    trust_level     VARCHAR(10) NOT NULL DEFAULT 'high'
                    CHECK (trust_level IN ('high', 'medium', 'low')),
    
    -- Admin review
    admin_reviewed  BOOLEAN DEFAULT FALSE,
    admin_override  VARCHAR(10)
                    CHECK (admin_override IN ('high', 'medium', 'low', NULL)),
    admin_notes     TEXT,
    
    -- Meta
    calculated_at   TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trust_submission ON trust_scores(submission_id);
CREATE INDEX idx_trust_user ON trust_scores(user_id);
CREATE INDEX idx_trust_level ON trust_scores(trust_level);
```

### 9. `recruiter_actions`
Track recruiter interactions with candidates.

```sql
CREATE TABLE recruiter_actions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recruiter_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    candidate_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Action
    action_type     VARCHAR(30) NOT NULL
                    CHECK (action_type IN (
                        'view_passport', 'shortlist', 'unshortlist',
                        'request_contact', 'download_passport'
                    )),
    
    -- Meta
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recruiter_actions_recruiter ON recruiter_actions(recruiter_id);
CREATE INDEX idx_recruiter_actions_candidate ON recruiter_actions(candidate_id);
CREATE INDEX idx_recruiter_actions_type ON recruiter_actions(action_type);
```

### 10. `sessions` (Optional — can use JWT only)
```sql
CREATE TABLE sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      VARCHAR(255) NOT NULL UNIQUE,
    expires_at      TIMESTAMP NOT NULL,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_token ON sessions(token_hash);
CREATE INDEX idx_sessions_expiry ON sessions(expires_at);
```

---

## Key Relationships

```
users (1) ──── (many) tasks
users (1) ──── (many) submissions
users (1) ──── (many) skill_scores
users (1) ──── (1)    skill_passports
tasks (1) ──── (1)    submissions (one submission per task per user)
submissions (1) ── (1) evaluation_results
submissions (1) ── (many) behavior_events
submissions (1) ── (1) trust_scores
users [recruiter] (1) ── (many) recruiter_actions
users [candidate] (1) ── (many) recruiter_actions
```

---

## Critical Queries

### 1. Recruiter Search (Most Important Query)
```sql
SELECT 
    u.id, u.full_name, u.location_city, u.location_state, 
    u.graduation_year, u.college_name,
    sp.overall_score, sp.api_score, sp.data_score, sp.debug_score,
    sp.trust_level, sp.overall_level, sp.public_slug
FROM users u
JOIN skill_passports sp ON u.id = sp.user_id
WHERE sp.is_active = TRUE
  AND sp.is_public = TRUE
  AND sp.overall_score >= :min_score
  AND sp.trust_level IN ('high', 'medium')
  AND (:state IS NULL OR u.location_state = :state)
  AND (:year IS NULL OR u.graduation_year = :year)
ORDER BY sp.overall_score DESC
LIMIT 50 OFFSET :offset;
```

### 2. Generate Skill Passport
```sql
-- After all 3 tasks are scored, aggregate into passport
INSERT INTO skill_passports (user_id, overall_score, api_score, data_score, debug_score, 
                             trust_level, public_slug, overall_level)
SELECT 
    :user_id,
    (COALESCE(api.score, 0) * 0.35 + 
     COALESCE(data.score, 0) * 0.35 + 
     COALESCE(debug.score, 0) * 0.30) AS overall_score,
    api.score, data.score, debug.score,
    CASE 
        WHEN MIN(ts.trust_level) = 'low' THEN 'low'
        WHEN MIN(ts.trust_level) = 'medium' THEN 'medium'
        ELSE 'high'
    END AS trust_level,
    :slug,
    CASE 
        WHEN overall_score >= 90 THEN 'expert'
        WHEN overall_score >= 75 THEN 'advanced'
        WHEN overall_score >= 60 THEN 'intermediate'
        WHEN overall_score >= 40 THEN 'developing'
        ELSE 'beginner'
    END
FROM skill_scores api 
LEFT JOIN skill_scores data ON data.user_id = :user_id AND data.skill_type = 'data_processing'
LEFT JOIN skill_scores debug ON debug.user_id = :user_id AND debug.skill_type = 'debugging'
LEFT JOIN trust_scores ts ON ts.user_id = :user_id
WHERE api.user_id = :user_id AND api.skill_type = 'api_design'
GROUP BY api.score, data.score, debug.score;
```

### 3. Anti-Cheat: Find Similar Submissions
```sql
-- This would be done in Python using TF-IDF/embeddings, not pure SQL
-- But we can find candidates for comparison:
SELECT s.id, s.code, s.task_id
FROM submissions s
JOIN tasks t ON s.task_id = t.id
WHERE t.task_type = :task_type
  AND s.id != :current_submission_id
  AND s.submitted_at > NOW() - INTERVAL '30 days'
LIMIT 100;
```

---

## Migration Strategy

```
migrations/
├── 001_create_users.sql
├── 002_create_tasks.sql
├── 003_create_submissions.sql
├── 004_create_evaluation_results.sql
├── 005_create_skill_scores.sql
├── 006_create_skill_passports.sql
├── 007_create_behavior_events.sql
├── 008_create_trust_scores.sql
├── 009_create_recruiter_actions.sql
└── 010_create_sessions.sql
```

Use Alembic for Python (auto-generates migrations from SQLAlchemy models).

---

## Data Volume Estimates (First 3 Months)

| Table | Estimated Rows | Size |
|-------|---------------|------|
| users | 500 | < 1 MB |
| tasks | 1,500 (3 per user) | < 5 MB |
| submissions | 1,500 | < 10 MB |
| evaluation_results | 1,500 | < 2 MB |
| skill_scores | 1,500 | < 1 MB |
| skill_passports | 500 | < 1 MB |
| behavior_events | 50,000 | < 20 MB |
| trust_scores | 1,500 | < 1 MB |
| recruiter_actions | 2,000 | < 1 MB |
| **Total** | **~60,000** | **< 50 MB** |

Well within PostgreSQL free tier limits (500 MB on Supabase, 1 GB on Railway).
