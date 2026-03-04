# API Design
## India's Skill Intelligence Network — MVP

**Base URL:** `https://api.isin.dev/v1`  
**Auth:** Bearer JWT Token  
**Format:** JSON  
**Docs:** Auto-generated at `/docs` (FastAPI Swagger UI)

---

## Authentication APIs

### POST `/auth/register`
Register a new user (candidate or recruiter).

**Request:**
```json
{
  "email": "priya@example.com",
  "password": "securePass123",
  "full_name": "Priya Sharma",
  "role": "candidate",
  "location_state": "Maharashtra",
  "location_city": "Pune",
  "graduation_year": 2025,
  "college_name": "PICT Pune"
}
```

**Response (201):**
```json
{
  "id": "uuid-xxx",
  "email": "priya@example.com",
  "full_name": "Priya Sharma",
  "role": "candidate",
  "access_token": "eyJhbG...",
  "token_type": "bearer"
}
```

**Errors:**
- `409`: Email already exists
- `422`: Validation error

---

### POST `/auth/login`
Login with email/password.

**Request:**
```json
{
  "email": "priya@example.com",
  "password": "securePass123"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbG...",
  "token_type": "bearer",
  "user": {
    "id": "uuid-xxx",
    "role": "candidate",
    "full_name": "Priya Sharma"
  }
}
```

---

### POST `/auth/google`
Google OAuth callback.

**Request:**
```json
{
  "google_token": "google-id-token-xxx",
  "role": "candidate"
}
```

**Response (200):** Same as login response.

---

### GET `/auth/me`
Get current user profile. **Requires Auth.**

**Response (200):**
```json
{
  "id": "uuid-xxx",
  "email": "priya@example.com",
  "full_name": "Priya Sharma",
  "role": "candidate",
  "location_state": "Maharashtra",
  "location_city": "Pune",
  "graduation_year": 2025,
  "college_name": "PICT Pune",
  "has_passport": true,
  "passport_slug": "priya-sharma-x7k2"
}
```

---

## Task APIs

### POST `/tasks/generate`
Generate 3 unique tasks for the current candidate. **Requires Auth (Candidate).**

**Request:**
```json
{
  "role_type": "python_backend"
}
```

**Response (201):**
```json
{
  "tasks": [
    {
      "id": "task-uuid-1",
      "task_type": "api_design",
      "title": "Build a Weather Data API Endpoint",
      "problem_statement": "Create a REST API endpoint that...",
      "constraints": [
        "Must use Flask or FastAPI",
        "Must handle invalid inputs gracefully",
        "Response time must be under 100ms"
      ],
      "starter_code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n# Your code here",
      "time_limit_mins": 45,
      "expires_at": "2026-03-04T12:45:00Z"
    },
    {
      "id": "task-uuid-2",
      "task_type": "data_processing",
      "title": "Parse and Transform Student Records",
      "problem_statement": "...",
      "constraints": ["..."],
      "starter_code": "...",
      "time_limit_mins": 45,
      "expires_at": "2026-03-04T12:45:00Z"
    },
    {
      "id": "task-uuid-3",
      "task_type": "debugging",
      "title": "Fix the Broken Inventory System",
      "problem_statement": "...",
      "constraints": ["..."],
      "starter_code": "...",
      "time_limit_mins": 45,
      "expires_at": "2026-03-04T12:45:00Z"
    }
  ]
}
```

**Errors:**
- `400`: Tasks already generated for this user
- `429`: Rate limited (max 1 generation per user)

---

### GET `/tasks/mine`
Get all tasks assigned to the current candidate. **Requires Auth (Candidate).**

**Response (200):**
```json
{
  "tasks": [
    {
      "id": "task-uuid-1",
      "task_type": "api_design",
      "title": "Build a Weather Data API Endpoint",
      "status": "submitted",
      "time_limit_mins": 45,
      "started_at": "2026-03-04T12:00:00Z",
      "expires_at": "2026-03-04T12:45:00Z"
    },
    {
      "id": "task-uuid-2",
      "task_type": "data_processing",
      "title": "Parse and Transform Student Records",
      "status": "in_progress",
      "time_limit_mins": 45,
      "started_at": "2026-03-04T13:00:00Z",
      "expires_at": "2026-03-04T13:45:00Z"
    },
    {
      "id": "task-uuid-3",
      "task_type": "debugging",
      "title": "Fix the Broken Inventory System",
      "status": "assigned",
      "time_limit_mins": 45,
      "started_at": null,
      "expires_at": null
    }
  ]
}
```

---

### GET `/tasks/{task_id}`
Get full task details. **Requires Auth (task owner only).**

**Response (200):** Full task object with problem statement and starter code (no test cases).

---

### POST `/tasks/{task_id}/start`
Mark task as started, begin countdown timer. **Requires Auth (Candidate).**

**Response (200):**
```json
{
  "task_id": "task-uuid-2",
  "status": "in_progress",
  "started_at": "2026-03-04T13:00:00Z",
  "expires_at": "2026-03-04T13:45:00Z",
  "remaining_seconds": 2700
}
```

---

## Submission APIs

### POST `/submissions`
Submit code for a task. **Requires Auth (Candidate).**

**Request:**
```json
{
  "task_id": "task-uuid-1",
  "code": "from fastapi import FastAPI\n\napp = FastAPI()\n\n@app.get('/weather')\ndef get_weather(city: str):\n    ...",
  "language": "python",
  "behavior_events": [
    {"event_type": "paste", "event_data": {"length": 50}, "session_time_ms": 120000},
    {"event_type": "tab_switch", "event_data": {}, "session_time_ms": 300000}
  ]
}
```

**Response (202):** Accepted for evaluation.
```json
{
  "submission_id": "sub-uuid-1",
  "status": "evaluating",
  "message": "Your code is being evaluated. Results in ~30 seconds.",
  "poll_url": "/submissions/sub-uuid-1/status"
}
```

**Errors:**
- `400`: Task expired or already submitted
- `413`: Code too large (> 50KB)

---

### GET `/submissions/{submission_id}/status`
Poll for evaluation status. **Requires Auth.**

**Response (200) — Still evaluating:**
```json
{
  "submission_id": "sub-uuid-1",
  "status": "evaluating",
  "stage": "running_tests"
}
```

**Response (200) — Completed:**
```json
{
  "submission_id": "sub-uuid-1",
  "status": "scored",
  "results": {
    "correctness_score": 85,
    "quality_score": 72,
    "approach_score": 78,
    "final_score": 79,
    "tests_passed": 6,
    "tests_total": 7,
    "trust_level": "high",
    "feedback": {
      "quality": "Good naming conventions. Consider adding error handling for edge cases.",
      "approach": "Efficient solution. Could improve by using a dictionary for O(1) lookups."
    }
  }
}
```

---

### GET `/submissions/mine`
Get all submissions for current user. **Requires Auth (Candidate).**

**Response (200):**
```json
{
  "submissions": [
    {
      "id": "sub-uuid-1",
      "task_id": "task-uuid-1",
      "task_type": "api_design",
      "status": "scored",
      "final_score": 79,
      "submitted_at": "2026-03-04T12:35:00Z"
    }
  ]
}
```

---

## Passport APIs

### GET `/passports/mine`
Get current user's passport. **Requires Auth (Candidate).**

**Response (200):**
```json
{
  "id": "passport-uuid-1",
  "user": {
    "full_name": "Priya Sharma",
    "location": "Pune, Maharashtra",
    "graduation_year": 2025,
    "college_name": "PICT Pune"
  },
  "overall_score": 79,
  "overall_level": "advanced",
  "skills": {
    "api_design": {"score": 79, "level": "advanced"},
    "data_processing": {"score": 82, "level": "advanced"},
    "debugging": {"score": 75, "level": "advanced"}
  },
  "trust_level": "high",
  "public_slug": "priya-sharma-x7k2",
  "public_url": "https://isin.dev/passport/priya-sharma-x7k2",
  "generated_at": "2026-03-04T14:00:00Z",
  "is_active": true
}
```

**Response (404):** Passport not yet generated (not all tasks completed).

---

### GET `/passports/{slug}` (PUBLIC — No Auth)
View anyone's public Skill Passport.

**Response (200):** Same as above but without sensitive user data.

**Response (404):** Passport not found or not public.

---

### PATCH `/passports/mine/visibility`
Toggle passport visibility. **Requires Auth (Candidate).**

**Request:**
```json
{
  "is_public": false
}
```

---

## Recruiter APIs

### GET `/recruiter/search`
Search verified candidates. **Requires Auth (Recruiter).**

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| min_score | float | Minimum overall score (0-100) |
| skill_type | string | Filter by specific skill |
| min_skill_score | float | Minimum score for skill_type |
| trust_level | string | "high", "medium", or "high,medium" |
| state | string | Indian state name |
| graduation_year | int | Filter by year |
| sort_by | string | "score" (default), "recent" |
| page | int | Page number (default: 1) |
| page_size | int | Results per page (default: 20, max: 50) |

**Example:** `GET /recruiter/search?min_score=70&state=Maharashtra&sort_by=score&page=1`

**Response (200):**
```json
{
  "candidates": [
    {
      "id": "uuid-xxx",
      "name": "Priya S.",
      "location": "Pune, Maharashtra",
      "graduation_year": 2025,
      "college": "PICT Pune",
      "overall_score": 82,
      "skills": {
        "api_design": 85,
        "data_processing": 78,
        "debugging": 83
      },
      "trust_level": "high",
      "overall_level": "advanced",
      "passport_slug": "priya-sharma-x7k2",
      "completed_at": "2026-03-04T14:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "page_size": 20,
    "total_results": 142,
    "total_pages": 8
  }
}
```

---

### POST `/recruiter/shortlist`
Shortlist a candidate. **Requires Auth (Recruiter).**

**Request:**
```json
{
  "candidate_id": "uuid-xxx"
}
```

**Response (201):**
```json
{
  "action": "shortlisted",
  "candidate_id": "uuid-xxx"
}
```

---

### GET `/recruiter/shortlist`
Get recruiter's shortlisted candidates. **Requires Auth (Recruiter).**

**Response (200):**
```json
{
  "shortlisted": [
    {
      "candidate_id": "uuid-xxx",
      "name": "Priya S.",
      "overall_score": 82,
      "shortlisted_at": "2026-03-04T15:00:00Z"
    }
  ]
}
```

---

### DELETE `/recruiter/shortlist/{candidate_id}`
Remove from shortlist. **Requires Auth (Recruiter).**

---

## Admin APIs

### GET `/admin/submissions`
List all submissions with filters. **Requires Auth (Admin).**

**Query Parameters:** status, trust_level, date_from, date_to, page

---

### GET `/admin/submissions/{id}/detail`
Full submission detail including code, scores, behavior events. **Requires Auth (Admin).**

---

### PATCH `/admin/trust-scores/{submission_id}`
Override trust score after manual review. **Requires Auth (Admin).**

**Request:**
```json
{
  "override_level": "high",
  "notes": "Reviewed manually - paste was from their own starter code"
}
```

---

### GET `/admin/stats`
Platform statistics. **Requires Auth (Admin).**

**Response (200):**
```json
{
  "total_users": 500,
  "total_candidates": 450,
  "total_recruiters": 50,
  "tasks_generated": 1350,
  "submissions_total": 1200,
  "submissions_scored": 1100,
  "passports_generated": 380,
  "avg_overall_score": 64.2,
  "recruiter_searches": 230,
  "shortlists": 89
}
```

---

## Behavior Events API (Client → Server)

### POST `/events/behavior`
Send behavior events during task session. **Requires Auth (Candidate).**

**Request:**
```json
{
  "task_id": "task-uuid-1",
  "events": [
    {
      "event_type": "paste",
      "event_data": {"char_count": 150, "content_hash": "sha256..."},
      "session_time_ms": 120000
    },
    {
      "event_type": "tab_switch",
      "event_data": {"away_duration_ms": 5000},
      "session_time_ms": 125000
    }
  ]
}
```

**Response (200):**
```json
{"received": 2}
```

---

## Error Format (All Endpoints)

```json
{
  "error": {
    "code": "TASK_EXPIRED",
    "message": "This task has expired. You cannot submit after the time limit.",
    "detail": null
  }
}
```

**Standard Error Codes:**
| Code | HTTP | Description |
|------|------|-------------|
| AUTH_REQUIRED | 401 | No or invalid JWT |
| FORBIDDEN | 403 | Wrong role for this endpoint |
| NOT_FOUND | 404 | Resource doesn't exist |
| ALREADY_EXISTS | 409 | Duplicate resource |
| VALIDATION_ERROR | 422 | Invalid request body |
| TASK_EXPIRED | 400 | Task time limit exceeded |
| TASK_ALREADY_SUBMITTED | 400 | Already submitted for this task |
| RATE_LIMITED | 429 | Too many requests |
| SERVER_ERROR | 500 | Internal error |

---

## Rate Limits

| Endpoint Pattern | Limit | Window |
|-----------------|-------|--------|
| POST /auth/* | 10 | per minute |
| POST /tasks/generate | 1 | per user (lifetime) |
| POST /submissions | 3 | per user per hour |
| POST /events/behavior | 60 | per minute |
| GET /recruiter/search | 30 | per minute |
| All other GET | 100 | per minute |

---

## Webhook Events (Post-MVP)

For future integrations:
```
candidate.passport.generated
candidate.passport.viewed
recruiter.candidate.shortlisted
submission.evaluation.completed
```
