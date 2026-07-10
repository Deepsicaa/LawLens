# LawLens — Architecture

## Core Principle

**LawLens never answers from model memory.**

Every response goes through retrieval → verification → citation before the user sees it. This is the architectural invariant the entire system is built around.

---

## Monorepo Structure

```
lawlens/
├── apps/
│   ├── web/              # Next.js 15 — frontend (deployed to Vercel)
│   └── api/              # FastAPI — AI pipeline + data (deployed to Railway)
├── packages/
│   └── types/            # Shared TypeScript types (API contract)
├── infrastructure/
│   └── docker/           # Local dev services (Postgres, Redis, Qdrant)
├── docs/                 # You are here
├── scripts/              # Data ingestion, seeding, utilities
└── .github/workflows/    # CI/CD pipelines
```

### Why a monorepo?

Single source of truth. The `packages/types` package defines the API contract once — TypeScript types shared between the frontend and any future TypeScript tooling. When the API changes, the frontend type-checks against it. Contract drift is caught at compile time.

### Why pnpm workspaces over Turborepo?

Turborepo shines when you have many JS/TS packages with complex build dependency graphs. LawLens has one web app + one shared types package. Turborepo's task graph is overhead without payoff here. pnpm workspaces handles dependency deduplication and cross-package resolution cleanly.

The Python backend is managed separately with `uv` — a Rust-based Python package manager with deterministic installs and a lock file.

---

## Frontend (`apps/web/`)

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · Shadcn UI · Framer Motion · GSAP · Lenis · Three.js + React Three Fiber

### App Router — Route Groups

```
src/app/
├── (marketing)/          # Public — landing, pricing, about
│   └── page.tsx          # Landing (Phase 2)
├── (auth)/               # Clerk-managed auth flows
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx
├── (app)/                # Protected — requires Clerk session
│   ├── layout.tsx        # App shell with sidebar
│   ├── dashboard/        # User overview
│   ├── ask/              # AI legal assistant interface
│   └── history/          # Conversation history
└── api/                  # Next.js API routes (BFF — thin proxy to FastAPI)
```

Route groups (`(marketing)`, `(auth)`, `(app)`) separate layout boundaries without affecting the URL. The marketing layout is full-bleed cinematic. The app layout has a persistent sidebar. The auth layout is minimal.

### Why React Server Components?

Legal document displays, citation panels, and static content are Server Components — zero client JavaScript for those trees. The AI streaming chat interface is a Client Component. This separation keeps the bundle small where it matters.

### Component Tree

```
src/components/
├── ui/                   # Shadcn UI primitives (Button, Card, Dialog, etc.)
├── layout/               # Header, Sidebar, Footer, Nav
├── marketing/            # Landing page sections (Hero, Features, CTA)
├── ai/                   # Chat, citations panel, evidence highlight, confidence bar
├── legal/                # Document explorer, source viewer, comparison table
└── 3d/                   # Three.js scenes (Globe, Scale, MagnifyingGlass)
```

### State Management

| Concern | Library | Why |
|---------|---------|-----|
| Server state (API data) | TanStack Query | Caching, invalidation, optimistic updates |
| Client UI state | Zustand | Simple, no boilerplate, works with RSC boundary |
| Auth state | Clerk | Fully managed, no implementation needed |
| Form state | React hook form + Zod | (Phase 3+) |

### Animation Philosophy

- **Framer Motion** — Component-level transitions, gesture-driven UI, page transitions
- **GSAP** — Landing page scroll timelines (GSAP is more powerful than Framer Motion for complex sequences)
- **Lenis** — Smooth scroll hijacking for cinematic landing page storytelling
- **React Three Fiber** — 3D objects embedded in React (Globe, Justice Scale, Legal documents)

Tailwind CSS v4 is used for all base styling. v4 drops the config file in favour of CSS-native `@theme {}` declarations — fewer build steps, native cascade layers, and faster HMR.

---

## Backend (`apps/api/`)

**Stack:** FastAPI · Python 3.12 · LangGraph · LlamaIndex · SQLModel · asyncpg · Redis · Qdrant

### Directory Structure

```
app/
├── api/v1/routes/
│   ├── legal.py          # POST /legal/query, POST /legal/compare
│   ├── conversations.py  # GET/DELETE /conversations, GET /conversations/:id
│   ├── webhooks.py       # POST /webhooks/clerk (sync user on sign-up)
│   └── admin.py          # GET /admin/stats, GET /admin/users
├── core/
│   ├── config.py         # Settings via pydantic-settings (reads .env)
│   ├── database.py       # SQLModel + asyncpg connection pool
│   ├── cache.py          # Redis async client
│   └── security.py       # Clerk JWT verification middleware
├── models/               # SQLModel ORM — PostgreSQL schema
│   ├── user.py
│   ├── conversation.py
│   ├── message.py
│   └── citation.py
├── schemas/              # Pydantic request/response shapes
│   ├── legal.py          # LegalQueryRequest, LegalQueryResponse
│   └── conversation.py
├── services/             # Business logic — orchestrates models + AI pipeline
│   ├── legal_service.py
│   └── conversation_service.py
└── ai/                   # AI pipeline (see ai-pipeline.md)
```

### Why FastAPI?

- **Async-first** — LLM calls and DB queries are I/O-bound. Async allows thousands of concurrent requests without threads.
- **Pydantic v2 native** — Request validation, response serialization, settings management all from one schema.
- **OpenAPI automatic** — Docs at `/docs` generated from code. The frontend TypeScript types can be auto-generated from this schema in the future.
- **Python** — The language of the AI/ML ecosystem. LangGraph, LlamaIndex, sentence-transformers, Qdrant SDK — all Python-native.

### API Versioning

All routes live under `/api/v1/`. When breaking changes are needed, `/api/v2/` is added. The frontend explicitly pins to a version, so old clients continue working while new clients migrate.

---

## AI Pipeline (`apps/api/app/ai/`)

See [ai-pipeline.md](ai-pipeline.md) for the full breakdown.

```
app/ai/
├── pipeline/
│   ├── graph.py          # LangGraph state machine — the pipeline definition
│   └── nodes.py          # Individual node implementations
├── retrievers/
│   ├── dense.py          # Qdrant vector search (voyage-law-2 embeddings)
│   ├── sparse.py         # BM25 sparse retrieval
│   └── hybrid.py         # Reciprocal Rank Fusion
├── rerankers/
│   └── cohere.py         # Cohere cross-encoder reranking
├── agents/
│   ├── verification.py   # Evidence verification agent
│   └── citation.py       # Citation extraction and formatting
├── jurisdictions/
│   ├── router.py         # Classify query → jurisdiction
│   ├── india.py          # India-specific config, prompts, citation format
│   ├── uk.py
│   ├── canada.py
│   └── australia.py
└── llm.py                # Anthropic Claude client wrapper
```

### Why LangGraph over LangChain chains?

LangChain chains are linear — A → B → C. Legal queries need branching:

- If jurisdiction confidence < 0.7 → ask user to clarify, don't proceed
- If retrieval quality < threshold → expand query, retry, not fail
- If verification flags issues → add warning, don't silently return bad answer

LangGraph models this as a state machine with conditional edges. Each node is independently observable, retryable, and testable.

### Why LlamaIndex?

LlamaIndex handles the document layer:
- Legal-aware text chunking (acts, sections, subsections)
- Embedding generation via Voyage AI
- Index management per jurisdiction collection
- Metadata attachment (source, section, URL) at ingestion time

It abstracts away the complexity of managing Qdrant collections while keeping the pipeline hackable.

---

## Database Architecture

See [database.md](database.md) for schema details.

### PostgreSQL — Relational data

| Table | Purpose |
|-------|---------|
| `users` | Synced from Clerk on webhook |
| `conversations` | Chat sessions, one per jurisdiction |
| `messages` | Individual messages (user + assistant) |
| `citations` | Citations linked to assistant messages |
| `analytics_events` | Funnel tracking, query analytics |

ORM: SQLModel (SQLAlchemy-compatible). Migrations: Alembic.

### Qdrant — Vector storage

One collection per jurisdiction. This is the key architectural decision:

| Collection | Purpose |
|-----------|---------|
| `india_legislation` | Indian laws, IPC, Constitution |
| `uk_legislation` | UK acts, statutory instruments |
| `canada_legislation` | Federal + provincial legislation |
| `australia_legislation` | Commonwealth acts, state legislation |

**Why one collection per jurisdiction, not a filtered single collection?**

1. Smaller index = faster HNSW traversal
2. No cross-jurisdiction contamination in results
3. Adding a country = new collection, no schema migration
4. Each jurisdiction can be independently scaled or replaced

### Redis — Cache and rate limiting

| Key pattern | Purpose | TTL |
|------------|---------|-----|
| `query:{hash}` | Cached legal query results | 1h |
| `rate:{user_id}:{endpoint}` | Per-user rate limiting | 1m |
| `session:{user_id}` | Session metadata | 24h |

---

## Deployment Architecture

See [deployment.md](deployment.md) for full config.

| Service | Platform | Trigger |
|---------|---------|---------|
| Frontend | Vercel | Push to `main` (path: `apps/web/**`) |
| Backend API | Railway | Push to `main` (path: `apps/api/**`) |
| PostgreSQL | Railway (managed) | Persistent |
| Redis | Railway (managed) | Persistent |
| Qdrant | Railway (Docker) or Qdrant Cloud | Persistent |

### Why Vercel for Next.js?

Zero-config. Edge network. Automatic preview deploys per PR. ISR and streaming work out of the box.

### Why Railway for FastAPI?

Railway is the simplest Docker-based deployment with managed PostgreSQL and Redis co-located with the API. Low latency between API and database matters when the pipeline does multiple DB round-trips per query.

---

## Security Model

| Concern | Approach |
|---------|---------|
| Authentication | Clerk handles all flows (OAuth, email/password, magic link) |
| Authorization | API verifies Clerk JWT on every protected endpoint |
| Row-level access | Users access only their own conversations |
| Rate limiting | Redis-backed per-user rate limits |
| Input validation | Pydantic validates all API inputs — no raw string handling |
| SQL injection | SQLModel ORM with parameterized queries |
| CORS | Strict allowlist — only the web app origin |
| Secrets | Environment variables — never in code or git |
| Production docs | `/docs` disabled in production env |

---

## Adding a New Country

The architecture is designed so adding a new jurisdiction requires:

1. Ingest official legal documents (scripts/ingest_documents.py)
2. Generate embeddings → create a new Qdrant collection
3. Add a jurisdiction config file (`app/ai/jurisdictions/newcountry.py`)
4. Register in `ENABLED_JURISDICTIONS` env var
5. Add `"newcountry"` to the `Jurisdiction` union type in `packages/types`

No architectural changes. No schema migrations. No pipeline rewrites.
