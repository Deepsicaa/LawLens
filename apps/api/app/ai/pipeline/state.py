"""LangGraph pipeline state — the shared data structure passed between nodes."""
from __future__ import annotations

from typing import TypedDict


class PipelineState(TypedDict, total=False):
    # Input
    question: str
    jurisdiction: str
    conversation_id: str | None

    # Jurisdiction routing
    jurisdiction_confidence: float
    jurisdiction_needs_clarification: bool

    # Query preprocessing
    expanded_query: str

    # Retrieval
    retrieved_chunks: list[dict]   # From hybrid retriever
    reranked_chunks: list[dict]    # After Cohere reranking
    context_text: str              # Formatted context for LLM

    # Generation
    raw_answer: str

    # Verification
    has_unsupported_claims: bool
    verification_notes: str

    # Citations
    citations: list[dict]

    # Confidence
    confidence_score: float

    # Final output
    answer: str
    processing_time_ms: int
    error: str | None
