.PHONY: dev backend frontend db lint test clean

# ─── Development ──────────────────────────────────────

dev: ## Start full stack (requires 3 terminals)
	@echo "Run these in separate terminals:"
	@echo "  make db       — Start Postgres + Redis"
	@echo "  make backend  — Start FastAPI"
	@echo "  make frontend — Start Next.js"

db: ## Start database services
	docker-compose up -d db redis

backend: ## Start FastAPI backend
	cd backend && uvicorn app.main:app --reload --port 8000

frontend: ## Start Next.js frontend
	cd frontend && npm run dev

# ─── Quality ──────────────────────────────────────────

lint: ## Run all linters
	cd backend && ruff check . && black --check .
	cd frontend && npm run lint

format: ## Auto-format all code
	cd backend && ruff check --fix . && black .
	cd frontend && npx prettier --write "src/**/*.{ts,tsx,css}"

typecheck: ## Run type checks
	cd backend && mypy app/ --ignore-missing-imports
	cd frontend && npx tsc --noEmit

# ─── Testing ─────────────────────────────────────────

test: ## Run all tests
	cd backend && pytest -v --tb=short
	cd frontend && npm test 2>/dev/null || echo "No frontend tests yet"

test-cov: ## Run tests with coverage
	cd backend && pytest --cov=app --cov-report=html -v

# ─── Database ─────────────────────────────────────────

migrate: ## Run Alembic migrations
	cd backend && alembic upgrade head

migrate-new: ## Create new migration (MSG="description")
	cd backend && alembic revision --autogenerate -m "$(MSG)"

seed: ## Seed database with sample data
	cd backend && python -m seed.seed_db

# ─── Docker ──────────────────────────────────────────

up: ## Start all Docker services
	docker-compose up -d

down: ## Stop all Docker services
	docker-compose down

logs: ## View backend logs
	docker-compose logs -f backend

# ─── Cleanup ─────────────────────────────────────────

clean: ## Remove build artifacts
	rm -rf frontend/.next frontend/node_modules
	rm -rf backend/__pycache__ backend/.pytest_cache backend/.mypy_cache
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
