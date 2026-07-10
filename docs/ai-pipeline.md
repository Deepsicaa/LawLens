# LawLens — AI Pipeline

## Overview

The pipeline guarantees that no answer reaches the user without evidence. The LLM is the last stage, not the first.

```
User Query
    │
    ▼
┌──────────────────────┐
│  Jurisdiction Router  │  Claude Haiku — fast classification
│  (LangGraph Node 1)   │  Output: { jurisdiction, confidence }
└──────────┬───────────┘
           │ confidence < 0.7 → ask user to clarify (early exit)
           ▼
┌──────────────────────┐
│  Query Preprocessor   │  Expand abbreviations, normalize citations
│  (LangGraph Node 2)   │  "IPC s302" → "Indian Penal Code Section 302"
└──────────┬───────────┘
           │
           ▼
┌────────────────────────────────────────────┐
│              Hybrid Retriever               │
│                                            │
│  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Dense Retrieval  │  │ Sparse (BM25)   │  │
│  │ voyage-law-2    │  │ TF-IDF + BM25   │  │
│  │ Qdrant HNSW     │  │ (in-memory)     │  │
│  │ Top-20          │  │ Top-20          │  │
│  └────────┬────────┘  └────────┬────────┘  │
│           └──────────┬─────────┘            │
│                 RRF  │ Fusion                │
│                      ▼                       │
│              Combined Top-30                 │
└──────────────────────┬─────────────────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  Cohere Reranker       │  Cross-encoder: sees query + doc together
           │  rerank-v3.5          │  Top-30 → Top-5 high-quality chunks
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  Context Builder       │  Format chunks as structured context
           │                        │  Attach metadata: source, section, URL
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  LLM                   │  Claude Sonnet — answer from context only
           │  (Grounded Generation) │  Streaming: tokens sent to frontend
           │                        │  System prompt: cite, don't fabricate
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  Verification Agent    │  Claude Haiku — check answer vs. evidence
           │                        │  Flags claims not in retrieved docs
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  Citation Generator    │  Extract citations from answer text
           │                        │  Format: { source, section, text, url }
           └───────────┬───────────┘
                       │
                       ▼
           ┌───────────────────────┐
           │  Confidence Scorer     │  Score = f(reranker, coverage, verification)
           │                        │  0.0 → 1.0 displayed to user
           └───────────┬───────────┘
                       │
                       ▼
                Final Response
```

---

## Why Each Decision Was Made

### Voyage AI (`voyage-law-2`) for Embeddings

`voyage-law-2` is purpose-built for legal text. It outperforms `text-embedding-3-large` (OpenAI) on legal retrieval benchmarks by a significant margin because it was trained on a corpus of legal documents.

For a legal AI platform, retrieval quality is the single most important metric. Getting this wrong means wrong answers, not just slightly worse answers. Voyage is the correct call.

### Cohere for Reranking

Bi-encoders (the embedding model) compute query and document vectors independently — they can't see each other during scoring. Cross-encoders (rerankers) see the full (query, document) pair together, which makes them dramatically better at relevance scoring.

Cohere's `rerank-v3.5` reduces 30 retrieved candidates to 5 high-quality chunks. This is the step that makes retrieval trustworthy rather than approximately useful.

### BM25 + Dense = Hybrid Retrieval

Dense retrieval finds semantically similar chunks but misses exact legal references:
- A query for "Section 302 IPC" needs exact keyword matching, not semantic similarity
- A query for "can I be arrested without a warrant" needs semantic understanding

BM25 catches exact matches that embeddings miss. Dense retrieval catches conceptual matches that keywords miss. Reciprocal Rank Fusion (RRF) merges both without needing score normalization: `score = Σ 1/(rank_i + k)` where k=60.

### LangGraph for Pipeline Orchestration

The pipeline isn't linear — it has conditional exits (low jurisdiction confidence → ask user), retry paths (low retrieval quality → query expansion), and parallel stages (verification can run while citations are being formatted).

LangGraph models this as a state machine. Each node is independently testable. The full pipeline state is observable at every step. Retry logic is handled per-node, not per-pipeline.

### Claude Haiku for Classification, Claude Sonnet for Generation

- **Jurisdiction Router + Verification Agent**: Claude Haiku — fast, cheap, classification tasks
- **Answer Generation**: Claude Sonnet — high-quality generation, the user-facing output

Using the right model size per task keeps latency and cost reasonable while not compromising output quality where it matters.

---

## Hallucination Prevention (Multi-Layer)

| Layer | Mechanism |
|-------|----------|
| 1. Retrieve first | Never pass an empty context to the LLM |
| 2. System prompt | "Answer only from the provided documents. If the answer is not in the documents, say so." |
| 3. Verification agent | Secondary LLM pass checks answer against retrieved evidence |
| 4. Confidence scoring | Low retrieval quality → low confidence score → visible warning |
| 5. Insufficient evidence | If reranker scores < threshold, return "insufficient evidence" instead of guessing |

---

## Jurisdiction-Specific Configuration

Each `app/ai/jurisdictions/{country}.py` defines:

```python
@dataclass
class JurisdictionConfig:
    collection: str           # Qdrant collection name
    citation_format: str      # e.g. "Indian Penal Code, Section {section}"
    source_url_pattern: str   # e.g. "https://indiacode.nic.in/..."
    system_prompt_suffix: str # Jurisdiction-specific LLM context
    chunk_size: int           # Tokens per chunk (legislation may differ)
    chunk_overlap: int
```

Adding a country = creating this file + registering the collection. No pipeline changes.

---

## Streaming Architecture

The LLM generation stage streams tokens to the Next.js frontend via Server-Sent Events (SSE). The pipeline returns early with a stream; citations and confidence scores are appended as a final event when the full generation + verification completes.

```
FastAPI SSE endpoint
    │ stream: token, token, token ...
    ▼
Next.js API route (BFF proxy)
    │ ReadableStream
    ▼
React Client Component
    │ useChat hook — appends tokens as they arrive
    ▼
User sees text appearing word by word
    │ [verification complete]
    ▼
Citations and confidence score render below the answer
```
