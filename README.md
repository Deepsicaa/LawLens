# LawLens

**See Law Clearly.**

AI-powered multi-jurisdiction legal intelligence. Answers grounded in official government legislation — never model memory.

---

## Architecture

```
lawlens/
├── apps/
│   ├── web/         → Next.js 15 frontend        (Vercel)
│   └── api/         → FastAPI AI pipeline         (Railway)
├── packages/
│   └── types/       → Shared TypeScript contract
├── infrastructure/
│   └── docker/      → Local dev services
├── docs/            → Architecture documentation
└── scripts/         → Data ingestion utilities
```

## Quick Start

**Prerequisites:** Node.js ≥22, pnpm ≥9, Python 3.12, uv, Docker

```bash
# First-time setup
make setup

# Start dev servers
make dev
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Qdrant UI | http://localhost:6333/dashboard |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS v4 |
| UI | Shadcn UI, Radix UI |
| Animation | Framer Motion, GSAP, Lenis |
| 3D | Three.js, React Three Fiber, Drei |
| Backend | FastAPI, Python 3.12 |
| AI Pipeline | LangGraph, LlamaIndex |
| Embeddings | Voyage AI (voyage-law-2) |
| Reranker | Cohere (rerank-v3.5) |
| LLM | Anthropic Claude |
| Vector DB | Qdrant |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | Clerk |
| Storage | Supabase |
| Deploy | Vercel + Railway |
| CI/CD | GitHub Actions |

## Documentation

- [Architecture](docs/architecture.md)
- [AI Pipeline](docs/ai-pipeline.md)
- [Database](docs/database.md)
- [Deployment](docs/deployment.md)

## Project Phases

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Project Foundation & Architecture | ✅ Complete |
| 2 | Landing Page | ⏳ Pending |
| 3 | Authentication | ⏳ Pending |
| 4 | Dashboard | ⏳ Pending |
| 5 | Legal Document Ingestion | ⏳ Pending |
| 6 | Embeddings | ⏳ Pending |
| 7 | RAG Pipeline | ⏳ Pending |
| 8 | Hallucination Reduction | ⏳ Pending |
| 9 | Jurisdiction Routing | ⏳ Pending |
| 10 | Comparison Mode | ⏳ Pending |
| 11 | Admin Dashboard | ⏳ Pending |
| 12 | Analytics | ⏳ Pending |
| 13 | Deployment | ⏳ Pending |
| 14 | Research | ⏳ Pending |
| 15 | Production | ⏳ Pending |
