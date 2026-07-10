"""Cohere cross-encoder reranking — the quality gate between retrieval and generation."""
from __future__ import annotations

import cohere

from app.core.config import settings

_cohere: cohere.AsyncClientV2 | None = None

RERANK_MODEL = "rerank-v3.5"


def get_cohere() -> cohere.AsyncClientV2:
    global _cohere
    if _cohere is None:
        _cohere = cohere.AsyncClientV2(api_key=settings.COHERE_API_KEY)
    return _cohere


async def rerank(
    query: str,
    candidates: list[dict],
    top_n: int = 5,
) -> list[dict]:
    """
    Cross-encoder reranking with Cohere rerank-v3.5.

    The cross-encoder sees the query AND the full document together,
    making it significantly better at relevance scoring than the
    bi-encoder (embedding similarity) approach used in retrieval.

    Args:
        query: The original user query
        candidates: Chunks from hybrid retrieval
        top_n: Number of chunks to return after reranking

    Returns:
        Top-n chunks sorted by reranker relevance score (descending)
    """
    if not candidates:
        return []

    documents = [c["text"] for c in candidates]

    response = await get_cohere().rerank(
        model=RERANK_MODEL,
        query=query,
        documents=documents,
        top_n=min(top_n, len(candidates)),
        return_documents=False,
    )

    reranked: list[dict] = []
    for result in response.results:
        chunk = candidates[result.index]
        reranked.append(
            {
                **chunk,
                "rerank_score": result.relevance_score,
                "rerank_rank": len(reranked) + 1,
            }
        )

    return reranked
