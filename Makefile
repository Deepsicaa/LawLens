.PHONY: dev dev-web dev-api db db-down db-logs install setup clean lint type-check migrate migrate-new

# ─── Development ──────────────────────────────────────────────────────────────

dev: ## Start all dev servers (web + api)
	@echo "→ Starting LawLens development environment..."
	@make -j2 dev-web dev-api

dev-web: ## Start Next.js dev server
	cd apps/web && pnpm dev

dev-api: ## Start FastAPI dev server
	cd apps/api && uv run uvicorn app.main:app --reload --port 8000

# ─── Database Services ────────────────────────────────────────────────────────

db: ## Start local services (PostgreSQL, Redis, Qdrant)
	docker compose -f infrastructure/docker/docker-compose.yml up -d
	@echo "→ Services started:"
	@echo "   PostgreSQL  → localhost:5432"
	@echo "   Redis       → localhost:6379"
	@echo "   Qdrant      → localhost:6333  (UI: localhost:6333/dashboard)"

db-down: ## Stop local services
	docker compose -f infrastructure/docker/docker-compose.yml down

db-logs: ## Tail local service logs
	docker compose -f infrastructure/docker/docker-compose.yml logs -f

db-reset: ## Wipe and restart local services (destructive)
	docker compose -f infrastructure/docker/docker-compose.yml down -v
	docker compose -f infrastructure/docker/docker-compose.yml up -d

# ─── Install ──────────────────────────────────────────────────────────────────

install: ## Install all dependencies
	pnpm install
	cd apps/api && uv sync

# ─── Setup (first time) ───────────────────────────────────────────────────────

setup: ## First-time project setup
	@./scripts/setup.sh

# ─── Code Quality ─────────────────────────────────────────────────────────────

lint: ## Lint all packages
	pnpm -r lint
	cd apps/api && uv run ruff check .

type-check: ## Type-check all packages
	pnpm -r type-check
	cd apps/api && uv run mypy app/

format: ## Format all files
	pnpm format
	cd apps/api && uv run ruff format .

# ─── Migrations ───────────────────────────────────────────────────────────────

migrate: ## Apply all pending database migrations
	cd apps/api && uv run alembic upgrade head

migrate-new: ## Create a new migration (MSG= required)
	cd apps/api && uv run alembic revision --autogenerate -m "$(MSG)"

migrate-down: ## Downgrade one migration
	cd apps/api && uv run alembic downgrade -1

# ─── Testing ──────────────────────────────────────────────────────────────────

test-api: ## Run API tests
	cd apps/api && uv run pytest tests/ -v

# ─── Clean ────────────────────────────────────────────────────────────────────

clean: ## Remove all build artifacts and caches
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .next -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .ruff_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true

# ─── Help ─────────────────────────────────────────────────────────────────────

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
