#!/usr/bin/env bash
set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  LawLens — First-time setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check required tools
echo "→ Checking required tools..."

command -v node >/dev/null 2>&1 || { echo "  ✗ Node.js is required (>=22). Install: https://nodejs.org"; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "  ✗ pnpm is required. Install: npm install -g pnpm"; exit 1; }
command -v uv >/dev/null 2>&1 || { echo "  ✗ uv is required. Install: curl -LsSf https://astral.sh/uv/install.sh | sh"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "  ✗ Docker is required. Install: https://www.docker.com"; exit 1; }

echo "  ✓ Node.js $(node --version)"
echo "  ✓ pnpm $(pnpm --version)"
echo "  ✓ uv $(uv --version)"
echo "  ✓ Docker $(docker --version | cut -d' ' -f3 | tr -d ',')"

# Copy env files
echo ""
echo "→ Setting up environment files..."

if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "  ✓ Created .env from .env.example (fill in your API keys)"
else
  echo "  · .env already exists, skipping"
fi

if [ ! -f "apps/web/.env.local" ]; then
  cp apps/web/.env.local.example apps/web/.env.local
  echo "  ✓ Created apps/web/.env.local (fill in your Clerk keys)"
else
  echo "  · apps/web/.env.local already exists, skipping"
fi

# Install dependencies
echo ""
echo "→ Installing JavaScript dependencies..."
pnpm install
echo "  ✓ pnpm workspace dependencies installed"

echo ""
echo "→ Installing Python dependencies..."
cd apps/api && uv sync && cd ../..
echo "  ✓ Python dependencies installed"

# Start local services
echo ""
echo "→ Starting local services (PostgreSQL, Redis, Qdrant)..."
docker compose -f infrastructure/docker/docker-compose.yml up -d
echo "  ✓ Services started"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Setup complete. Next steps:"
echo ""
echo "  1. Fill in API keys in .env and apps/web/.env.local"
echo "  2. Run: make dev"
echo ""
echo "  Services:"
echo "    PostgreSQL  → localhost:5432"
echo "    Redis       → localhost:6379"
echo "    Qdrant      → localhost:6333 (UI: http://localhost:6333/dashboard)"
echo "    Web         → http://localhost:3000 (after make dev)"
echo "    API         → http://localhost:8000 (after make dev)"
echo "    API Docs    → http://localhost:8000/docs (after make dev)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
