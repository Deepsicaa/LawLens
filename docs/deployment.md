# LawLens — Deployment Architecture

## Overview

| Service | Platform | URL Pattern |
|---------|---------|------------|
| Frontend (Next.js) | Vercel | `lawlens.com` |
| Backend API (FastAPI) | Railway | `api.lawlens.com` |
| PostgreSQL | Railway (managed) | Internal Railway network |
| Redis | Railway (managed) | Internal Railway network |
| Qdrant | Railway or Qdrant Cloud | Internal Railway network |

---

## Local Development

```bash
make setup      # First-time: install deps, copy env, start Docker services
make db         # Start Postgres + Redis + Qdrant via Docker Compose
make dev        # Start Next.js (port 3000) + FastAPI (port 8000)
```

Services available locally:
- **Web**: http://localhost:3000
- **API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Qdrant UI**: http://localhost:6333/dashboard

---

## CI/CD Pipelines

### On every PR

`.github/workflows/ci.yml` runs:
1. Web lint (ESLint) + type check (TypeScript)
2. API lint (Ruff) + type check (mypy)
3. API tests (pytest) against real Postgres + Redis

PRs are blocked from merging if any check fails.

### On merge to `main`

Two independent deploy pipelines fire in parallel based on changed paths:

**`apps/web/**` changed →** `deploy-web.yml`
- Type check + build verification
- Deploy to Vercel production

**`apps/api/**` changed →** `deploy-api.yml`
- Run tests
- Deploy to Railway (triggers Railway to pull and rebuild Docker image)

---

## Environment Variables by Platform

### Vercel (Web)

Set in Vercel dashboard → Project → Settings → Environment Variables:

```
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_API_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Railway (API + Services)

Set in Railway dashboard → Service → Variables:

```
APP_ENV=production
APP_URL=https://lawlens.com
API_URL=https://api.lawlens.com
SECRET_KEY=
ANTHROPIC_API_KEY=
VOYAGE_API_KEY=
COHERE_API_KEY=
DATABASE_URL=        # Auto-injected by Railway Postgres plugin
REDIS_URL=           # Auto-injected by Railway Redis plugin
QDRANT_URL=
QDRANT_API_KEY=
CLERK_SECRET_KEY=
CLERK_WEBHOOK_SECRET=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
EMBEDDING_MODEL=voyage-law-2
EMBEDDING_DIMENSIONS=1024
ENABLED_JURISDICTIONS=india,uk,canada,australia
```

---

## Docker

The API is containerized for consistent deploys. The Dockerfile uses a multi-stage build:

1. **Builder stage**: Install `uv`, sync production dependencies
2. **Runtime stage**: Copy virtual env + app source, run as non-root user

Build locally:
```bash
cd apps/api
docker build -t lawlens-api .
docker run -p 8000:8000 --env-file .env lawlens-api
```

---

## Scaling Considerations

- **FastAPI workers**: Set `--workers N` in the Dockerfile CMD. For Railway, 2–4 workers is typical.
- **Qdrant**: If query volume grows, move from Railway-hosted Qdrant to Qdrant Cloud which supports horizontal scaling and replication.
- **Redis**: Railway Redis is single-node. For production at scale, consider Redis Cloud with a replica.
- **PostgreSQL**: Railway Postgres supports read replicas for read-heavy workloads (conversation history queries).
