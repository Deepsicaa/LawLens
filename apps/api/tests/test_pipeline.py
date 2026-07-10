"""Unit tests for pipeline components."""
import pytest
from app.ai.retrievers.hybrid import _rrf_score
from app.ai.pipeline.nodes import build_context, score_confidence
from app.ai.pipeline.state import PipelineState


def test_rrf_score_decreases_with_rank() -> None:
    """Higher ranks should have lower RRF scores."""
    assert _rrf_score(1) > _rrf_score(10) > _rrf_score(20)


def test_rrf_score_never_zero() -> None:
    """RRF score is always positive."""
    assert _rrf_score(1000) > 0


def test_build_context_empty() -> None:
    """Build context with no chunks produces empty string."""
    state: PipelineState = {
        "question": "test",
        "jurisdiction": "india",
        "reranked_chunks": [],
    }
    result = build_context(state)
    assert result["context_text"] == ""


def test_build_context_with_chunks() -> None:
    """Build context includes source and text."""
    state: PipelineState = {
        "question": "test",
        "jurisdiction": "india",
        "reranked_chunks": [
            {
                "id": "1",
                "text": "Whoever commits murder shall be punished with death.",
                "source": "Indian Penal Code",
                "section": "Section 302",
                "url": "https://indiacode.nic.in",
                "rerank_score": 0.9,
                "rerank_rank": 1,
            }
        ],
    }
    result = build_context(state)
    assert "Section 302" in result["context_text"]
    assert "murder" in result["context_text"]


def test_confidence_score_no_chunks() -> None:
    """No retrieved chunks → low confidence."""
    state: PipelineState = {
        "question": "test",
        "jurisdiction": "india",
        "reranked_chunks": [],
        "has_unsupported_claims": False,
    }
    result = score_confidence(state)
    assert result["confidence_score"] < 0.3


def test_confidence_score_high_quality() -> None:
    """Good chunks + no unsupported claims → high confidence."""
    state: PipelineState = {
        "question": "test",
        "jurisdiction": "india",
        "reranked_chunks": [
            {"rerank_score": 0.95},
            {"rerank_score": 0.90},
            {"rerank_score": 0.88},
            {"rerank_score": 0.85},
        ],
        "has_unsupported_claims": False,
    }
    result = score_confidence(state)
    assert result["confidence_score"] > 0.7
