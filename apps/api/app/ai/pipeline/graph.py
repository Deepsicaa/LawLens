"""LangGraph pipeline definition — connects nodes into a state machine."""
from __future__ import annotations

import time

from langgraph.graph import StateGraph, END

from app.ai.pipeline.state import PipelineState
from app.ai.pipeline.nodes import (
    preprocess_query,
    retrieve_documents,
    rerank_documents,
    build_context,
    generate_answer,
    extract_citations,
    score_confidence,
)
from app.ai.agents.verification import verify_answer
from app.ai.agents.jurisdiction_router import route_jurisdiction


def _needs_clarification(state: PipelineState) -> str:
    """Conditional edge: if jurisdiction confidence is too low, return early."""
    if state.get("jurisdiction_needs_clarification"):
        return "needs_clarification"
    return "continue"


def _has_context(state: PipelineState) -> str:
    """Conditional edge: skip generation if no documents were retrieved."""
    if not state.get("reranked_chunks"):
        return "no_context"
    return "continue"


def build_pipeline() -> StateGraph:
    graph = StateGraph(PipelineState)

    # Add nodes
    graph.add_node("route_jurisdiction", route_jurisdiction)
    graph.add_node("preprocess_query", preprocess_query)
    graph.add_node("retrieve_documents", retrieve_documents)
    graph.add_node("rerank_documents", rerank_documents)
    graph.add_node("build_context", build_context)
    graph.add_node("generate_answer", generate_answer)
    graph.add_node("verify_answer", verify_answer)
    graph.add_node("extract_citations", extract_citations)
    graph.add_node("score_confidence", score_confidence)

    # Entry point
    graph.set_entry_point("route_jurisdiction")

    # Conditional: needs jurisdiction clarification?
    graph.add_conditional_edges(
        "route_jurisdiction",
        _needs_clarification,
        {
            "needs_clarification": END,
            "continue": "preprocess_query",
        },
    )

    # Linear flow: preprocess → retrieve → rerank
    graph.add_edge("preprocess_query", "retrieve_documents")
    graph.add_edge("retrieve_documents", "rerank_documents")

    # Conditional: did we get enough context?
    graph.add_conditional_edges(
        "rerank_documents",
        _has_context,
        {
            "no_context": "extract_citations",  # Skip to empty citations + low confidence
            "continue": "build_context",
        },
    )

    # Main generation path
    graph.add_edge("build_context", "generate_answer")
    graph.add_edge("generate_answer", "verify_answer")
    graph.add_edge("verify_answer", "extract_citations")
    graph.add_edge("extract_citations", "score_confidence")
    graph.add_edge("score_confidence", END)

    return graph


# Compiled pipeline (singleton)
_pipeline = None


def get_pipeline():
    global _pipeline
    if _pipeline is None:
        _pipeline = build_pipeline().compile()
    return _pipeline


async def run_pipeline(
    question: str,
    jurisdiction: str,
    conversation_id: str | None = None,
) -> PipelineState:
    """
    Run the full RAG pipeline and return the final state.
    This is the main entry point for legal queries.
    """
    start = time.monotonic()

    initial_state: PipelineState = {
        "question": question,
        "jurisdiction": jurisdiction,
        "conversation_id": conversation_id,
        "error": None,
    }

    pipeline = get_pipeline()
    final_state: PipelineState = await pipeline.ainvoke(initial_state)

    elapsed_ms = int((time.monotonic() - start) * 1000)
    return {**final_state, "processing_time_ms": elapsed_ms}
