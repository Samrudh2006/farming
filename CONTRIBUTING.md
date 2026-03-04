# Contributing to ISIN

Thank you for considering contributing to India's Skill Intelligence Network!

## Development Setup

### Prerequisites

- **Node.js** 20+
- **Python** 3.12+
- **Docker** + Docker Compose
- **Git**

### Quick Start

```bash
# Clone
git clone https://github.com/Samrudh2006/farming.git
cd farming

# Start database
docker-compose up -d db redis

# Backend
cd backend
python -m venv venv
.\venv\Scripts\activate         # Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload

# Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

## Branch Naming

- `feat/description` — New features
- `fix/description` — Bug fixes
- `refactor/description` — Code refactoring
- `docs/description` — Documentation

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add task generation endpoint
fix: correct JWT expiration handling
docs: update API documentation
refactor: extract evaluation service
test: add submission flow tests
```

## Code Style

### Frontend (TypeScript/React)
- ESLint + Prettier configured (auto-format on save)
- Use functional components with hooks
- Use `cn()` utility for conditional Tailwind classes
- React Query for all API calls (use hooks from `hooks/use-queries.ts`)

### Backend (Python/FastAPI)
- Ruff + Black configured (auto-format on save)
- Type hints on all function signatures
- Async/await for all database operations
- Pydantic schemas for all request/response validation

## Pull Request Process

1. Create a feature branch from `main`
2. Write/update tests for your changes
3. Ensure CI passes (lint + tests + build)
4. Request review from a team member
5. Squash merge into `main`

## Architecture Decisions

Before making significant architectural changes, please:
1. Read the existing docs in `/docs/`
2. Open an issue to discuss the proposed change
3. Reference the relevant doc (ARCHITECTURE.md, API-DESIGN.md, etc.)
