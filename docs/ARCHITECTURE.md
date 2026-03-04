# System Architecture
## India's Skill Intelligence Network — MVP

---

## Architecture Diagram (Text-Based)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENTS                                       │
│    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐         │
│    │  Candidate    │    │  Recruiter   │    │    Admin     │         │
│    │  Browser      │    │  Browser     │    │  Browser     │         │
│    └──────┬───────┘    └──────┬───────┘    └──────┬───────┘         │
└───────────┼───────────────────┼───────────────────┼─────────────────┘
            │                   │                   │
            ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                                │
│                                                                       │
│  ┌─────────────┐ ┌──────────────┐ ┌────────────┐ ┌──────────────┐  │
│  │ Landing Page │ │ Task Workspace│ │ Skill      │ │ Recruiter    │  │
│  │ + Auth      │ │ + Monaco     │ │ Passport   │ │ Dashboard    │  │
│  │             │ │ Editor       │ │ (Public)   │ │ + Search     │  │
│  └─────────────┘ └──────────────┘ └────────────┘ └──────────────┘  │
│                                                                       │
│  Hosted on: Vercel (free tier) or same Railway container              │
└───────────────────────────┬─────────────────────────────────────────┘
                            │ HTTPS / REST API
                            ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    API GATEWAY (FastAPI)                              │
│                    Single Monolith Service                            │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                     API Routes                               │    │
│  │                                                               │    │
│  │  /api/auth/*          Authentication & session management     │    │
│  │  /api/tasks/*         Task generation & submission            │    │
│  │  /api/evaluate/*      Trigger AI evaluation                   │    │
│  │  /api/passport/*      Skill Passport CRUD & public view      │    │
│  │  /api/recruiter/*     Recruiter search & candidate browse     │    │
│  │  /api/admin/*         Admin operations                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                                                                       │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    CORE MODULES                                │  │
│  │                                                                 │  │
│  │  ┌─────────────────┐  ┌──────────────────┐  ┌──────────────┐  │  │
│  │  │ Task Generation │  │ AI Evaluation    │  │ Skill Scoring │  │  │
│  │  │ Engine          │  │ Pipeline         │  │ Engine        │  │  │
│  │  │                 │  │                  │  │               │  │  │
│  │  │ - Prompt builder│  │ - Code executor  │  │ - Score       │  │  │
│  │  │ - Parameterizer │  │ - Test runner    │  │   aggregation │  │  │
│  │  │ - Task validator│  │ - LLM evaluator  │  │ - Passport    │  │  │
│  │  │ - LLM client   │  │ - Score combiner │  │   generator   │  │  │
│  │  └────────┬────────┘  └────────┬─────────┘  └──────┬───────┘  │  │
│  │           │                    │                     │          │  │
│  │  ┌────────┴────────┐  ┌───────┴──────────┐  ┌──────┴───────┐  │  │
│  │  │ Anti-Cheat      │  │ Code Sandbox     │  │ Recruiter    │  │  │
│  │  │ Module          │  │ (Docker/Judge0)  │  │ Search       │  │  │
│  │  │                 │  │                  │  │ Engine       │  │  │
│  │  │ - Paste detect  │  │ - Isolated exec  │  │              │  │  │
│  │  │ - Tab tracking  │  │ - Resource limits│  │ - SQL filter │  │  │
│  │  │ - Similarity    │  │ - Timeout mgmt   │  │ - Score rank │  │  │
│  │  │ - Trust scorer  │  │ - Output capture │  │ - Full-text  │  │  │
│  │  └─────────────────┘  └──────────────────┘  └──────────────┘  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Hosted on: Railway (single container, ~$5-10/mo)                    │
└──────────┬───────────────────┬──────────────────────┬───────────────┘
           │                   │                      │
           ▼                   ▼                      ▼
┌──────────────────┐ ┌─────────────────┐  ┌────────────────────────┐
│  PostgreSQL      │ │  Redis          │  │  OpenAI API            │
│  (Primary DB)    │ │  (Queue/Cache)  │  │  (GPT-4o-mini)         │
│                  │ │                 │  │                        │
│  - Users         │ │  - Task queue   │  │  - Task generation     │
│  - Tasks         │ │  - Rate limits  │  │  - Code evaluation     │
│  - Submissions   │ │  - Session cache│  │  - Quality scoring     │
│  - Scores        │ │                 │  │                        │
│  - Passports     │ │  Optional: can  │  │  ~$0.15/1M input tok  │
│  - Anti-cheat    │ │  skip for MVP   │  │  ~$0.60/1M output tok │
│                  │ │  (use DB queue) │  │                        │
│  Supabase free   │ │  Upstash free   │  │  Pay-per-use           │
│  or Railway      │ │  tier           │  │                        │
└──────────────────┘ └─────────────────┘  └────────────────────────┘
```

---

## Component Breakdown

### 1. Task Generation Engine

```
┌─────────────────────────────────────────────────────┐
│              TASK GENERATION ENGINE                   │
│                                                       │
│  Input: {role: "python_backend", user_id: "abc123"}  │
│                                                       │
│  Step 1: Select Task Template                        │
│    ├── api_design_template                           │
│    ├── data_processing_template                      │
│    └── debugging_template                            │
│                                                       │
│  Step 2: Parameterize (make unique per user)         │
│    ├── Inject user-specific seed (user_id hash)      │
│    ├── Randomize: variable names, data values,       │
│    │   endpoint paths, error types                   │
│    └── Generate unique test cases                    │
│                                                       │
│  Step 3: LLM Generation                             │
│    ├── Send parameterized prompt to GPT-4o-mini      │
│    ├── Receive: problem statement, constraints,      │
│    │   starter code, hidden test cases               │
│    └── Validate: is task solvable? well-formed?      │
│                                                       │
│  Step 4: Store                                       │
│    ├── Save task + test cases to PostgreSQL           │
│    ├── Mark as assigned to user                      │
│    └── Set expiry (45 min from assignment)           │
│                                                       │
│  Output: {task_id, problem_statement, starter_code,  │
│           constraints, time_limit}                   │
└─────────────────────────────────────────────────────┘
```

**LLM Prompt Structure:**
```
System: You are a coding assessment generator for junior Python backend developers.
Generate a unique task based on these parameters:

Task Type: {api_design | data_processing | debugging}
Difficulty: Junior (1-2 years experience)
Unique Seed: {hash(user_id + timestamp)}
Variable Theme: {randomly selected: e-commerce, weather, library, hospital, school}

Output JSON:
{
  "title": "...",
  "problem_statement": "...",
  "constraints": ["..."],
  "starter_code": "...",
  "hidden_test_cases": [
    {"input": "...", "expected_output": "...", "description": "..."}
  ],
  "time_limit_minutes": 45,
  "evaluation_rubric": "..."
}

Rules:
- Task MUST be solvable by a junior Python developer in 30-45 minutes
- Include 5-8 hidden test cases including edge cases
- Variable names and data values must use the theme and seed for uniqueness
- Do NOT use well-known LeetCode/HackerRank problems
```

### 2. AI Evaluation Pipeline

```
┌─────────────────────────────────────────────────────────┐
│              AI EVALUATION PIPELINE                       │
│                                                           │
│  Input: {submission_id, code, task_id, behavior_events}  │
│                                                           │
│  ┌─────────────────────────────────────┐                 │
│  │ Stage 1: CODE EXECUTION             │                 │
│  │                                     │                 │
│  │  1. Pull task's hidden test cases   │                 │
│  │  2. Spin up Docker container        │                 │
│  │     - Python 3.11 image             │                 │
│  │     - 256MB RAM limit               │                 │
│  │     - 10s timeout per test          │                 │
│  │     - No network access             │                 │
│  │  3. Run each test case              │                 │
│  │  4. Capture stdout, stderr, time    │                 │
│  │  5. Compare output vs expected      │                 │
│  │                                     │                 │
│  │  Output: correctness_score (0-100)  │                 │
│  │  = (passed / total) × 100          │                 │
│  └─────────────────┬───────────────────┘                 │
│                    ▼                                      │
│  ┌─────────────────────────────────────┐                 │
│  │ Stage 2: CODE QUALITY (LLM)        │                 │
│  │                                     │                 │
│  │  Send to GPT-4o-mini:              │                 │
│  │  - Candidate's code                │                 │
│  │  - Original problem statement      │                 │
│  │  - Evaluation rubric               │                 │
│  │                                     │                 │
│  │  LLM scores (0-100 each):          │                 │
│  │  - Naming conventions              │                 │
│  │  - Code readability                │                 │
│  │  - Error handling                  │                 │
│  │  - Edge case coverage              │                 │
│  │                                     │                 │
│  │  Output: quality_score (0-100)     │                 │
│  │  = average of sub-scores           │                 │
│  └─────────────────┬───────────────────┘                 │
│                    ▼                                      │
│  ┌─────────────────────────────────────┐                 │
│  │ Stage 3: APPROACH QUALITY (LLM)    │                 │
│  │                                     │                 │
│  │  LLM evaluates:                    │                 │
│  │  - Algorithm choice                │                 │
│  │  - Time/space complexity           │                 │
│  │  - Design patterns used            │                 │
│  │  - Code organization               │                 │
│  │                                     │                 │
│  │  Output: approach_score (0-100)    │                 │
│  └─────────────────┬───────────────────┘                 │
│                    ▼                                      │
│  ┌─────────────────────────────────────┐                 │
│  │ Stage 4: ANTI-CHEAT CHECK          │                 │
│  │                                     │                 │
│  │  1. Copy-paste event count          │                 │
│  │  2. Tab-switch event count          │                 │
│  │  3. Code similarity vs other subs   │                 │
│  │  4. Typing pattern analysis         │                 │
│  │                                     │                 │
│  │  Output: trust_score (high/med/low) │                 │
│  └─────────────────┬───────────────────┘                 │
│                    ▼                                      │
│  ┌─────────────────────────────────────┐                 │
│  │ Stage 5: SCORE AGGREGATION         │                 │
│  │                                     │                 │
│  │  final = 0.4 × correctness         │                 │
│  │        + 0.3 × quality             │                 │
│  │        + 0.3 × approach            │                 │
│  │                                     │                 │
│  │  Store in DB                       │                 │
│  │  Update Skill Passport             │                 │
│  └─────────────────────────────────────┘                 │
│                                                           │
│  Output: {final_score, breakdown, trust_score}           │
└─────────────────────────────────────────────────────────┘
```

### 3. Skill Scoring Logic

```
┌─────────────────────────────────────────────────────┐
│              SKILL SCORING ENGINE                     │
│                                                       │
│  Per-Task Score:                                     │
│    task_score = 0.4 × correctness                    │
│               + 0.3 × code_quality                   │
│               + 0.3 × approach_quality               │
│                                                       │
│  Overall Skill Score (across 3 tasks):               │
│    api_skill     = task_1_score (API Design task)    │
│    data_skill    = task_2_score (Data Processing)    │
│    debug_skill   = task_3_score (Debugging task)     │
│                                                       │
│    overall_score = 0.35 × api_skill                  │
│                  + 0.35 × data_skill                 │
│                  + 0.30 × debug_skill                │
│                                                       │
│  Skill Level Mapping:                                │
│    90-100: Expert        ████████████████████         │
│    75-89:  Advanced      ██████████████████           │
│    60-74:  Intermediate  ████████████████             │
│    40-59:  Developing    ████████████                 │
│    0-39:   Beginner      ████████                     │
│                                                       │
│  Trust Modifier:                                     │
│    high trust   → score as-is                        │
│    medium trust → score shown with warning badge     │
│    low trust    → score hidden, flagged for review   │
│                                                       │
│  Passport Generation Trigger:                        │
│    When all 3 tasks scored → Generate/update passport│
└─────────────────────────────────────────────────────┘
```

### 4. Skill Graph Storage (MVP: Simplified)

```
┌─────────────────────────────────────────────────────┐
│           SKILL DATA MODEL (PostgreSQL)              │
│                                                       │
│  For MVP, NO graph database. Use relational model.   │
│  Graph DB (Neo4j) only needed post-MVP when we have  │
│  skill relationships and multi-role support.          │
│                                                       │
│  Table: skill_scores                                 │
│  ┌──────────────┬────────────┬─────────────────────┐ │
│  │ user_id      │ FK → users │                     │ │
│  │ skill_type   │ ENUM       │ api/data/debug      │ │
│  │ score        │ FLOAT      │ 0-100               │ │
│  │ correctness  │ FLOAT      │ 0-100               │ │
│  │ quality      │ FLOAT      │ 0-100               │ │
│  │ approach     │ FLOAT      │ 0-100               │ │
│  │ evaluated_at │ TIMESTAMP  │                     │ │
│  └──────────────┴────────────┴─────────────────────┘ │
│                                                       │
│  Table: skill_passports                              │
│  ┌──────────────┬────────────┬─────────────────────┐ │
│  │ user_id      │ FK → users │                     │ │
│  │ overall_score│ FLOAT      │ 0-100               │ │
│  │ trust_level  │ ENUM       │ high/medium/low     │ │
│  │ public_slug  │ VARCHAR    │ unique shareable ID  │ │
│  │ generated_at │ TIMESTAMP  │                     │ │
│  │ is_active    │ BOOLEAN    │                     │ │
│  └──────────────┴────────────┴─────────────────────┘ │
│                                                       │
│  POST-MVP: Migrate to Neo4j for:                     │
│  - Skill → Sub-skill relationships                   │
│  - Cross-role skill mapping                          │
│  - Skill gap analysis                                │
│  - Learning path generation                          │
└─────────────────────────────────────────────────────┘
```

### 5. Anti-Cheat Detection

```
┌─────────────────────────────────────────────────────┐
│              ANTI-CHEAT MODULE                       │
│                                                       │
│  CLIENT-SIDE (JavaScript in code editor):            │
│  ┌─────────────────────────────────────────────┐    │
│  │ Event Collector                              │    │
│  │                                               │    │
│  │ 1. Paste events → count + content length     │    │
│  │ 2. Tab visibility changes → count + duration │    │
│  │ 3. Keystroke timing → intervals array        │    │
│  │ 4. Mouse activity → active/idle periods      │    │
│  │                                               │    │
│  │ Sends: behavior_events[] to backend          │    │
│  │ on submission                                │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  SERVER-SIDE (Python):                               │
│  ┌─────────────────────────────────────────────┐    │
│  │ Trust Score Calculator                       │    │
│  │                                               │    │
│  │ Signal 1: Paste ratio                        │    │
│  │   paste_chars / total_chars > 0.5 → flag     │    │
│  │                                               │    │
│  │ Signal 2: Tab switches                       │    │
│  │   switches > 5 during task → flag            │    │
│  │                                               │    │
│  │ Signal 3: Typing pattern                     │    │
│  │   Long idle + sudden burst → flag            │    │
│  │   (suggests copy from external source)       │    │
│  │                                               │    │
│  │ Signal 4: Code similarity                    │    │
│  │   TF-IDF vectorize submission                │    │
│  │   Compare cosine similarity with other subs  │    │
│  │   for same task type                         │    │
│  │   similarity > 0.85 → flag                   │    │
│  │                                               │    │
│  │ Trust Score:                                  │    │
│  │   0 flags → HIGH                             │    │
│  │   1-2 flags → MEDIUM                         │    │
│  │   3+ flags → LOW                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  POST-MVP: Add browser proctoring, webcam,          │
│  keystroke dynamics ML model                         │
└─────────────────────────────────────────────────────┘
```

### 6. Recruiter Search Layer

```
┌─────────────────────────────────────────────────────┐
│              RECRUITER SEARCH ENGINE                  │
│                                                       │
│  MVP: Pure SQL with PostgreSQL full-text search      │
│  (No Elasticsearch needed for < 10,000 candidates)   │
│                                                       │
│  Search Query Builder:                               │
│  ┌─────────────────────────────────────────────┐    │
│  │                                               │    │
│  │  SELECT u.*, sp.overall_score, sp.trust_level │    │
│  │  FROM users u                                 │    │
│  │  JOIN skill_passports sp ON u.id = sp.user_id │    │
│  │  WHERE sp.is_active = true                    │    │
│  │    AND sp.overall_score >= :min_score         │    │
│  │    AND sp.trust_level IN (:trust_levels)      │    │
│  │    AND u.location_state = :state              │    │
│  │    AND u.graduation_year = :year              │    │
│  │  ORDER BY sp.overall_score DESC               │    │
│  │  LIMIT 50 OFFSET :page × 50                  │    │
│  │                                               │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  Filters Available:                                  │
│  ┌──────────────────┬───────────────────────────┐   │
│  │ min_score        │ 0-100 slider              │   │
│  │ skill_type       │ api / data / debug        │   │
│  │ trust_level      │ high / medium             │   │
│  │ location_state   │ dropdown (Indian states)  │   │
│  │ graduation_year  │ 2024, 2025, 2026          │   │
│  │ sort_by          │ score / recency           │   │
│  └──────────────────┴───────────────────────────┘   │
│                                                       │
│  Response:                                           │
│  ┌─────────────────────────────────────────────┐    │
│  │ {                                             │    │
│  │   "candidates": [                             │    │
│  │     {                                         │    │
│  │       "name": "Priya S.",                     │    │
│  │       "overall_score": 82,                    │    │
│  │       "skills": {                             │    │
│  │         "api_design": 85,                     │    │
│  │         "data_processing": 78,                │    │
│  │         "debugging": 83                       │    │
│  │       },                                      │    │
│  │       "trust_level": "high",                  │    │
│  │       "location": "Pune, Maharashtra",        │    │
│  │       "passport_url": "/passport/priya-s-x7"  │    │
│  │     }                                         │    │
│  │   ],                                          │    │
│  │   "total": 142,                               │    │
│  │   "page": 1                                   │    │
│  │ }                                             │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  POST-MVP: Add Elasticsearch for fuzzy search,      │
│  skill-based ranking algorithm, AI match scoring     │
└─────────────────────────────────────────────────────┘
```

---

## Architecture Decisions

### Monolith vs Microservices: **MONOLITH**

| Factor | Monolith (Chosen) | Microservices |
|--------|-------------------|---------------|
| Team size (2-3) | ✅ Perfect | ❌ Overkill |
| Dev speed | ✅ Fast | ❌ Slow (inter-service communication) |
| Deployment | ✅ Single container | ❌ K8s/Docker Compose needed |
| Debugging | ✅ Single log stream | ❌ Distributed tracing needed |
| Cost | ✅ $5-10/mo | ❌ $50-100/mo minimum |
| When to split | When you hit 10K users or 5+ devs | - |

**Exception:** Code sandbox runs as a separate Docker container for security isolation.

### Database: **PostgreSQL (SQL)**

| Why PostgreSQL | Why NOT NoSQL/Graph |
|----------------|---------------------|
| Structured data (users, tasks, scores) | MongoDB: No advantage for structured data |
| ACID for score calculations | Cassandra: Overkill for our scale |
| Full-text search built-in | Neo4j: No skill relationships in MVP |
| JSON columns for flexible data | DynamoDB: Vendor lock-in |
| Free tier everywhere | Redis: Use only for caching/queue |
| Every developer knows SQL | - |

**Post-MVP:** Add Redis for caching. Add Neo4j only when skill graph becomes relational.

### AI Model Integration: **API-Based, Not Self-Hosted**

```
┌─────────────────────────────────────────────────────┐
│  AI MODEL INTEGRATION STRATEGY                       │
│                                                       │
│  MVP: OpenAI API (GPT-4o-mini)                       │
│  ┌─────────────────────────────────────────────┐    │
│  │ Why GPT-4o-mini:                             │    │
│  │ - $0.15/1M input tokens, $0.60/1M output    │    │
│  │ - Fast (< 3 sec response)                    │    │
│  │ - Good enough for task gen + code eval       │    │
│  │ - No GPU needed (API call)                   │    │
│  │ - Structured JSON output mode available      │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  Integration Pattern:                                │
│  ┌─────────────────────────────────────────────┐    │
│  │                                               │    │
│  │  class LLMService:                            │    │
│  │      def __init__(self):                      │    │
│  │          self.client = OpenAI(api_key=...)     │    │
│  │          self.model = "gpt-4o-mini"           │    │
│  │                                               │    │
│  │      async def generate_task(self, params):   │    │
│  │          # ~800 input tokens, ~1500 output    │    │
│  │          # Cost: ~$0.001 per task             │    │
│  │                                               │    │
│  │      async def evaluate_code(self, code, ...):│    │
│  │          # ~2000 input tokens, ~500 output    │    │
│  │          # Cost: ~$0.001 per evaluation       │    │
│  │                                               │    │
│  │  Total per candidate (3 tasks):               │    │
│  │    3 × generate + 3 × evaluate = ~$0.006     │    │
│  │    1000 candidates = ~$6                      │    │
│  │                                               │    │
│  └─────────────────────────────────────────────┘    │
│                                                       │
│  Fallback Strategy:                                  │
│  1. Primary: GPT-4o-mini                             │
│  2. Fallback: Claude 3.5 Haiku (if OpenAI is down)  │
│  3. Emergency: Pre-generated task bank (50 tasks)    │
│                                                       │
│  POST-MVP:                                           │
│  - Fine-tune open-source model (Llama 3) on our     │
│    task→score data for cheaper evaluation            │
│  - Self-host on GPU for cost reduction at scale      │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### Candidate Task Flow
```
Candidate                    Frontend           Backend              LLM              Sandbox         DB
   │                            │                  │                  │                  │             │
   │── Click "Start Tasks" ────►│                  │                  │                  │             │
   │                            │── POST /tasks ──►│                  │                  │             │
   │                            │                  │── Generate ──────►│                  │             │
   │                            │                  │◄── Task JSON ────│                  │             │
   │                            │                  │── Store task ────────────────────────────────────►│
   │                            │◄── Task data ────│                  │                  │             │
   │◄── Show task + editor ─────│                  │                  │                  │             │
   │                            │                  │                  │                  │             │
   │── Write code, submit ─────►│                  │                  │                  │             │
   │                            │── POST /submit ─►│                  │                  │             │
   │                            │                  │── Run code ──────────────────────────►│             │
   │                            │                  │◄── Test results ─────────────────────│             │
   │                            │                  │── Evaluate code──►│                  │             │
   │                            │                  │◄── Scores ───────│                  │             │
   │                            │                  │── Store scores ──────────────────────────────────►│
   │                            │◄── Results ──────│                  │                  │             │
   │◄── Show scores ────────────│                  │                  │                  │             │
```

### Recruiter Search Flow
```
Recruiter                    Frontend           Backend              DB
   │                            │                  │                  │
   │── Set filters ────────────►│                  │                  │
   │                            │── GET /search? ─►│                  │
   │                            │                  │── SQL query ────►│
   │                            │                  │◄── Results ──────│
   │                            │◄── Candidates ──│                  │
   │◄── Show list + scores ────│                  │                  │
   │                            │                  │                  │
   │── Click "View Passport" ──►│                  │                  │
   │                            │── GET /passport/►│                  │
   │                            │                  │── Fetch ────────►│
   │                            │◄── Passport data│◄── Data ─────────│
   │◄── Show full passport ────│                  │                  │
```

---

## Deployment Architecture

```
┌──────────────────────────────────────────────────┐
│                  DEPLOYMENT (MVP)                  │
│                                                    │
│  Option A: Railway (Recommended)                  │
│  ┌──────────────────────────────────────────┐    │
│  │  Service 1: Next.js + FastAPI             │    │
│  │  (single Dockerfile, ~$5/mo)              │    │
│  │                                            │    │
│  │  Service 2: PostgreSQL                    │    │
│  │  (Railway managed, ~$5/mo)                │    │
│  │                                            │    │
│  │  Service 3: Code Sandbox Worker           │    │
│  │  (Docker-in-Docker, ~$5/mo)               │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  Option B: Vercel + Railway                       │
│  ┌──────────────────────────────────────────┐    │
│  │  Vercel: Next.js frontend (free)          │    │
│  │  Railway: FastAPI backend ($5/mo)         │    │
│  │  Supabase: PostgreSQL (free)              │    │
│  │  Railway: Sandbox worker ($5/mo)          │    │
│  └──────────────────────────────────────────┘    │
│                                                    │
│  Total: ₹500-1500/mo ($5-15/mo)                 │
│                                                    │
│  POST-MVP: AWS/GCP when scaling needed            │
└──────────────────────────────────────────────────┘
```

---

## File/Module Structure

```
isin/
├── frontend/                    # Next.js 14 App Router
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx        # Candidate dashboard
│   │   ├── tasks/
│   │   │   ├── page.tsx        # Task list
│   │   │   └── [id]/page.tsx   # Task workspace + editor
│   │   ├── passport/
│   │   │   └── [slug]/page.tsx # Public skill passport
│   │   ├── recruiter/
│   │   │   ├── page.tsx        # Recruiter dashboard
│   │   │   └── search/page.tsx # Candidate search
│   │   └── admin/
│   │       └── page.tsx        # Admin panel
│   ├── components/
│   │   ├── CodeEditor.tsx      # Monaco wrapper
│   │   ├── SkillPassport.tsx   # Passport display
│   │   ├── ScoreChart.tsx      # Score visualization
│   │   └── CandidateCard.tsx   # Search result card
│   └── lib/
│       ├── api.ts              # API client
│       └── auth.ts             # Auth utilities
│
├── backend/                     # FastAPI
│   ├── main.py                 # App entry point
│   ├── config.py               # Environment config
│   ├── models/                 # SQLAlchemy models
│   │   ├── user.py
│   │   ├── task.py
│   │   ├── submission.py
│   │   ├── score.py
│   │   └── passport.py
│   ├── routes/                 # API endpoints
│   │   ├── auth.py
│   │   ├── tasks.py
│   │   ├── submissions.py
│   │   ├── passports.py
│   │   ├── recruiter.py
│   │   └── admin.py
│   ├── services/               # Business logic
│   │   ├── task_generator.py   # LLM task generation
│   │   ├── code_executor.py    # Docker sandbox runner
│   │   ├── evaluator.py        # AI evaluation pipeline
│   │   ├── scorer.py           # Score aggregation
│   │   ├── anticheat.py        # Anti-cheat detection
│   │   └── llm_client.py       # OpenAI wrapper
│   ├── db/
│   │   ├── database.py         # DB connection
│   │   └── migrations/         # Alembic migrations
│   └── tests/
│       ├── test_task_gen.py
│       ├── test_evaluator.py
│       └── test_scorer.py
│
├── sandbox/                     # Code execution sandbox
│   ├── Dockerfile              # Python 3.11 sandbox image
│   ├── runner.py               # Execute code safely
│   └── limits.py               # Resource limits config
│
├── docker-compose.yml          # Local dev setup
├── Dockerfile                  # Production build
├── .env.example                # Environment variables
└── README.md
```

---

## Cost Optimization Strategy

| Strategy | How | Savings |
|----------|-----|---------|
| Use GPT-4o-mini not GPT-4 | 10x cheaper per token | ~90% on LLM costs |
| Batch LLM calls | Evaluate all 3 tasks in one API call | ~40% fewer API calls |
| Cache task templates | Store generated tasks; parameterize at runtime | ~50% fewer generation calls |
| Use free tiers aggressively | Supabase, Vercel, Resend, PostHog, Sentry | $0 for many services |
| No GPU hosting | API-only LLM usage | $0 compute for AI |
| Single container deployment | One server for everything | ~$5-10/mo total |
| Defer real-time features | No WebSockets, no live updates | Simpler infra |
| PostgreSQL for everything | One DB = one bill | No Redis/Elasticsearch cost |
