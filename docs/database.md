# LawLens — Database Architecture

## PostgreSQL Schema

### users

Synced from Clerk via webhook on sign-up. We store a minimal shadow user — Clerk is the source of truth for identity.

```sql
CREATE TABLE users (
    id          TEXT PRIMARY KEY,        -- Clerk user ID (user_xxx)
    email       TEXT NOT NULL UNIQUE,
    name        TEXT,
    image_url   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### conversations

One conversation per jurisdiction per session. Users can have many conversations.

```sql
CREATE TABLE conversations (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title        TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,          -- india | uk | canada | australia
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_jurisdiction ON conversations(jurisdiction);
```

### messages

Each message stores the full content and metadata at write time. Citations are denormalized into the message for read performance.

```sql
CREATE TABLE messages (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id  UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    role             TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content          TEXT NOT NULL,
    confidence_score FLOAT,              -- NULL for user messages
    has_unsupported_claims BOOLEAN,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
```

### citations

Linked to assistant messages. Stores enough context to display inline without re-fetching.

```sql
CREATE TABLE citations (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id       UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    source           TEXT NOT NULL,      -- e.g. "Indian Penal Code"
    section          TEXT NOT NULL,      -- e.g. "Section 302"
    text             TEXT NOT NULL,      -- Exact legislation text
    url              TEXT,               -- Official source URL
    jurisdiction     TEXT NOT NULL,
    relevance_score  FLOAT NOT NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_citations_message_id ON citations(message_id);
```

### analytics_events

Append-only event log for product analytics. Never mutated.

```sql
CREATE TABLE analytics_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     TEXT REFERENCES users(id) ON DELETE SET NULL,
    event_type  TEXT NOT NULL,           -- query.submitted, citation.clicked, etc.
    properties  JSONB NOT NULL DEFAULT '{}',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
```

---

## Qdrant Collections

### Collection per Jurisdiction

| Collection | Embedding model | Dimensions | Distance |
|-----------|----------------|-----------|---------|
| `india_legislation` | voyage-law-2 | 1024 | Cosine |
| `uk_legislation` | voyage-law-2 | 1024 | Cosine |
| `canada_legislation` | voyage-law-2 | 1024 | Cosine |
| `australia_legislation` | voyage-law-2 | 1024 | Cosine |

### Vector Payload Schema

Each vector stored with metadata for display without re-fetching from PostgreSQL:

```json
{
  "source": "Indian Penal Code",
  "section": "Section 302",
  "section_title": "Punishment for murder",
  "text": "Whoever commits murder shall be punished with death, or imprisonment for life...",
  "url": "https://indiacode.nic.in/handle/123456789/2263",
  "jurisdiction": "india",
  "act_year": 1860,
  "chunk_index": 0
}
```

---

## Redis Key Patterns

| Pattern | Type | TTL | Purpose |
|---------|------|-----|---------|
| `query:{sha256_hash}` | String (JSON) | 3600s | Cached query results |
| `rate:{user_id}:{endpoint}` | Counter | 60s | Rate limiting |
| `session:{user_id}` | Hash | 86400s | Session metadata |

Cache key is a SHA-256 hash of `(question, jurisdiction)` — identical questions to the same jurisdiction return cached results.
