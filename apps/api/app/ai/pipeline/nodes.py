"""LangGraph pipeline nodes — each performs one stage of the pipeline."""
from __future__ import annotations

import json
import re

from app.ai.llm import complete, HAIKU, SONNET
from app.ai.retrievers.hybrid import hybrid_retrieve
from app.ai.rerankers.cohere import rerank
from app.ai.jurisdictions import get_jurisdiction
from app.ai.pipeline.state import PipelineState


# ─── Node 1: Query Preprocessor ──────────────────────────────────────────────

async def preprocess_query(state: PipelineState) -> PipelineState:
    """
    Expand and normalize the query for better retrieval.
    Expands abbreviations, normalizes section references.
    """
    question = state["question"]
    jurisdiction = state.get("jurisdiction", "")

    config = get_jurisdiction(jurisdiction)

    prompt = f"""You are a legal query preprocessor for {config.name} law.

User query: {question!r}

Task: Expand this query to improve document retrieval. Do the following:
1. Expand legal abbreviations (e.g., "IPC" → "Indian Penal Code")
2. Normalize section references (e.g., "s.302" → "Section 302")
3. Add relevant legal terminology that might appear in legislation
4. Keep the original meaning intact

Return ONLY the expanded query, nothing else. One sentence max."""

    expanded = await complete(
        system="You are a legal query preprocessing assistant.",
        messages=[{"role": "user", "content": prompt}],
        model=HAIKU,
        max_tokens=256,
        temperature=0,
    )

    return {**state, "expanded_query": expanded.strip()}


# ─── Node 2: Hybrid Retriever ─────────────────────────────────────────────────

async def retrieve_documents(state: PipelineState) -> PipelineState:
    """Run hybrid retrieval (dense + BM25 + RRF)."""
    query = state.get("expanded_query", state["question"])
    config = get_jurisdiction(state["jurisdiction"])

    candidates = await hybrid_retrieve(
        query=query,
        collection=config.qdrant_collection,
        dense_top_k=20,
        sparse_top_k=20,
        final_top_k=30,
    )

    return {**state, "retrieved_chunks": candidates}


# ─── Node 3: Reranker ─────────────────────────────────────────────────────────

async def rerank_documents(state: PipelineState) -> PipelineState:
    """Cross-encoder reranking — top 30 → top 5."""
    candidates = state.get("retrieved_chunks", [])
    query = state.get("expanded_query", state["question"])

    top_chunks = await rerank(query=query, candidates=candidates, top_n=5)

    return {**state, "reranked_chunks": top_chunks}


# ─── Node 4: Context Builder ──────────────────────────────────────────────────

def build_context(state: PipelineState) -> PipelineState:
    """Format retrieved chunks as structured context for the LLM."""
    chunks = state.get("reranked_chunks", [])

    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        source = chunk.get("source", "")
        section = chunk.get("section", "")
        text = chunk.get("text", "")
        url = chunk.get("url", "")

        header = f"[Document {i}]"
        if source:
            header += f" {source}"
        if section:
            header += f", {section}"
        if url:
            header += f" ({url})"

        context_parts.append(f"{header}\n{text}")

    context_text = "\n\n---\n\n".join(context_parts)
    return {**state, "context_text": context_text}


# ─── Node 5: LLM Generation ───────────────────────────────────────────────────

GENERATION_SYSTEM_TEMPLATE = """You are LawLens, an AI legal research assistant.

You answer legal questions using ONLY the documents provided below. You do not use any knowledge from your training data.

Rules you MUST follow:
1. Answer ONLY from the provided documents. If the answer is not in the documents, say "Based on the retrieved documents, I cannot find sufficient information to answer this question definitively."
2. NEVER fabricate laws, sections, cases, or citations.
3. Every factual claim must be traceable to the provided documents.
4. Use plain language. Avoid legal jargon unless quoting directly from the legislation.
5. When citing, use the format provided in each document header.
6. If documents are insufficient or conflicting, say so explicitly.

{jurisdiction_suffix}

Retrieved Documents:
{context}
"""


async def generate_answer(state: PipelineState) -> PipelineState:
    """Generate a grounded answer from retrieved context."""
    config = get_jurisdiction(state["jurisdiction"])
    context = state.get("context_text", "")

    if not context.strip():
        return {
            **state,
            "raw_answer": (
                "I was unable to retrieve sufficient legal documents to answer your question. "
                "Please try rephrasing or selecting a different jurisdiction."
            ),
        }

    system = GENERATION_SYSTEM_TEMPLATE.format(
        jurisdiction_suffix=config.system_prompt_suffix,
        context=context,
    )

    answer = await complete(
        system=system,
        messages=[{"role": "user", "content": state["question"]}],
        model=SONNET,
        max_tokens=2048,
        temperature=0.1,
    )

    return {**state, "raw_answer": answer}


# ─── Node 6: Citation Extraction ─────────────────────────────────────────────

async def extract_citations(state: PipelineState) -> PipelineState:
    """Extract citations from the answer and link to retrieved chunks."""
    chunks = state.get("reranked_chunks", [])
    answer = state.get("raw_answer", "")

    citations = []
    for i, chunk in enumerate(chunks):
        if not chunk.get("text"):
            continue

        citations.append(
            {
                "id": chunk.get("id", str(i)),
                "source": chunk.get("source", ""),
                "section": chunk.get("section", ""),
                "text": chunk.get("text", "")[:500],  # Truncate for response
                "url": chunk.get("url"),
                "jurisdiction": state["jurisdiction"],
                "relevanceScore": chunk.get("rerank_score", 0.0),
            }
        )

    return {**state, "citations": citations, "answer": answer}


# ─── Node 7: Confidence Scorer ────────────────────────────────────────────────

def score_confidence(state: PipelineState) -> PipelineState:
    """
    Compute confidence score (0.0 – 1.0) based on:
    - Retrieval quality (mean reranker score of top chunks): 40% weight
    - Evidence coverage (did we find enough?): 40% weight
    - Verification result: 20% weight
    """
    chunks = state.get("reranked_chunks", [])
    has_unsupported = state.get("has_unsupported_claims", False)

    # Component 1: Retrieval quality
    if chunks:
        rerank_scores = [c.get("rerank_score", 0.0) for c in chunks]
        retrieval_score = sum(rerank_scores) / len(rerank_scores)
    else:
        retrieval_score = 0.0

    # Component 2: Evidence coverage (based on chunk count)
    chunk_count = len(chunks)
    if chunk_count >= 4:
        coverage_score = 1.0
    elif chunk_count == 3:
        coverage_score = 0.85
    elif chunk_count == 2:
        coverage_score = 0.65
    elif chunk_count == 1:
        coverage_score = 0.40
    else:
        coverage_score = 0.0

    # Component 3: Verification
    verification_score = 0.7 if has_unsupported else 1.0

    # Weighted average
    confidence = (
        retrieval_score * 0.40
        + coverage_score * 0.40
        + verification_score * 0.20
    )

    return {**state, "confidence_score": round(min(max(confidence, 0.0), 1.0), 3)}
