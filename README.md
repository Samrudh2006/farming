# India's Skill Intelligence Network (ISIN)

## Kill the Resume. Verify the Skill.

A skill-based hiring infrastructure platform that replaces traditional resumes with AI-verified **Skill Passports**.

---

## What Problem We Solve

| Problem | Our Solution |
|---------|-------------|
| Resumes are self-reported lies | AI-verified skill scores from real tasks |
| Hiring is keyword-matching theater | Recruiters search proven skill graphs |
| Candidates have no portable proof | Dynamic Skill Passport follows them everywhere |
| Assessment platforms use MCQs | We generate unique real-world tasks per user |
| No way to detect copied solutions | Anti-cheat + unique task generation per candidate |

---

## MVP Focus (3-Month Build)

**One Role:** Junior Backend Developer (Python)  
**One User Flow:** Candidate completes AI-generated coding tasks → Gets verified Skill Passport → Recruiter searches by skill score  
**One Market:** Tier-2/3 engineering colleges in India

---

## Core Components

1. **Task Generation Engine** — LLM generates unique coding challenges per user
2. **AI Evaluation Pipeline** — Automated code quality + correctness scoring
3. **Skill Passport** — Shareable profile with verified scores
4. **Recruiter Search** — Filter candidates by verified skill scores
5. **Basic Anti-Cheat** — Plagiarism detection + behavioral signals

---

## Documentation

| Document | Description |
|----------|-------------|
| [PRD](docs/PRD.md) | Product Requirements Document |
| [MVP Plan](docs/MVP-PLAN.md) | 3-Month Brutal MVP Plan |
| [Architecture](docs/ARCHITECTURE.md) | System Architecture & Components |
| [Database Schema](docs/DATABASE-SCHEMA.md) | Core DB Design |
| [Tech Stack](docs/TECH-STACK.md) | Technology Decisions |
| [API Design](docs/API-DESIGN.md) | API Specifications |
| [Metrics & Risks](docs/METRICS-AND-RISKS.md) | Success Metrics & Technical Risks |
| [Validation Plan](docs/VALIDATION-PLAN.md) | Pre-Build Validation Strategy |
| [Roadmap](docs/ROADMAP.md) | Phased Roadmap |
| [Cost Optimization](docs/COST-OPTIMIZATION.md) | Cost Strategy |
| [Anti-Cheat](docs/ANTI-CHEAT.md) | Anti-Cheat Detection System |
| [Asset Index](docs/ASSET-INDEX.md) | SVG Asset Library & Usage Guide |

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Samrudh2006/farming.git && cd farming

# 2. Start infrastructure with Docker
docker-compose up -d db redis

# 3. Backend
cd backend
python -m venv venv && venv\Scripts\activate  # Windows
pip install -r requirements.txt
cp .env.example .env                           # Edit with your keys
uvicorn app.main:app --reload

# 4. Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000 (frontend) and http://localhost:8000/docs (API docs).

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS, Framer Motion |
| Backend | FastAPI, SQLAlchemy (async), PostgreSQL, Alembic |
| AI | GPT-4o-mini (evaluation), behavioral analysis |
| Infra | Docker, GitHub Actions CI/CD, Vercel + Railway |

---

## Project Structure

```
ISIN/
├── README.md
├── LICENSE
├── .gitignore
├── docker-compose.yml              # Postgres + Redis + Backend + Judge0
├── .github/workflows/ci.yml        # CI/CD pipeline
│
├── docs/                           # 12 documentation files
│   ├── PRD.md                      # Product Requirements
│   ├── MVP-PLAN.md                 # 3-Month Build Plan
│   ├── ARCHITECTURE.md             # System Architecture
│   ├── DATABASE-SCHEMA.md          # PostgreSQL Schema
│   ├── TECH-STACK.md               # Technology Decisions
│   ├── API-DESIGN.md               # REST API Specs
│   ├── METRICS-AND-RISKS.md        # KPIs & Risks
│   ├── VALIDATION-PLAN.md          # Pre-Build Validation
│   ├── ROADMAP.md                  # Phased Roadmap
│   ├── COST-OPTIMIZATION.md        # Cost Strategy
│   ├── ANTI-CHEAT.md               # 5-Signal Detection
│   └── ASSET-INDEX.md              # SVG Asset Index
│
├── assets/                         # 44 SVG visual assets
│   ├── logos/ (4)  ├── icons/ (9)  ├── backgrounds/ (5)
│   ├── badges/ (9) ├── ui/ (7)    ├── social/ (3)
│   └── illustrations/ (7)
│
├── frontend/                       # Next.js 15 + TypeScript
│   ├── src/
│   │   ├── app/                    # Pages (App Router)
│   │   │   ├── page.tsx            # Landing page with animations
│   │   │   ├── login/              # Auth pages
│   │   │   ├── register/
│   │   │   ├── dashboard/          # Candidate dashboard
│   │   │   ├── tasks/              # Task listing + [id] detail
│   │   │   ├── passport/           # Skill Passport view
│   │   │   └── recruiter/          # Recruiter search
│   │   ├── components/
│   │   │   ├── ui/                 # Button, Card, Input, Badge, etc.
│   │   │   ├── layout/             # Navbar, Footer
│   │   │   ├── auth/               # Login/Register forms
│   │   │   ├── task/               # TaskCard
│   │   │   └── passport/           # PassportCard
│   │   ├── lib/                    # utils, api client, animations
│   │   ├── hooks/                  # useTimer, useDebounce, etc.
│   │   ├── stores/                 # Zustand auth store
│   │   └── types/                  # TypeScript interfaces
│   ├── .env.example
│   ├── .prettierrc
│   └── package.json
│
└── backend/                        # FastAPI + SQLAlchemy
    ├── app/
    │   ├── main.py                 # FastAPI app entry point
    │   ├── core/                   # Config, database, security (JWT)
    │   ├── models/                 # 8 SQLAlchemy ORM models
    │   ├── schemas/                # Pydantic request/response schemas
    │   ├── api/routes/             # 6 route modules (auth, tasks, etc.)
    │   ├── services/               # Business logic (TODO)
    │   └── utils/                  # Helpers (TODO)
    ├── alembic/                    # Database migrations
    ├── seed/                       # JSON fixtures + seed script
    ├── tests/                      # Pytest async tests
    ├── Dockerfile
    ├── .env.example
    ├── requirements.txt
    └── pyproject.toml              # Black, Ruff, MyPy, Pytest config
```

---

## Team

- 2-4 founders
- 3-month runway
- India-focused
- Build the data moat first, features second

---

## License

Proprietary. All rights reserved.
