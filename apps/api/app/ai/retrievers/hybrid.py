"""Hybrid retrieval: Dense + BM25 fused with Reciprocal Rank Fusion (RRF)."""
from __future__ import annotations

import asyncio

from app.ai.retrievers.dense import dense_retrieve
from app.ai.retrievers.sparse import sparse_retrieve

RRF_K = 60  # Standard RRF constant — smooths rank differences


def _rrf_score(rank: int) -> float:
    """Reciprocal Rank Fusion score for a given rank (1-indexed)."""
    return 1.0 / (RRF_K + rank)


async def hybrid_retrieve(
    query: str,
    collection: str,
    dense_top_k: int = 20,
    sparse_top_k: int = 20,
    final_top_k: int = 30,
) -> list[dict]:
    """
    Run dense and sparse retrieval in parallel, fuse with RRF.
    Returns up to final_top_k candidates ranked by combined RRF score.
    """
    dense_results, sparse_results = await asyncio.gather(
        dense_retrieve(query, collection, dense_top_k),
        sparse_retrieve(query, collection, sparse_top_k),
    )

    # Build score accumulator keyed by chunk ID
    scores: dict[str, float] = {}
    chunk_by_id: dict[str, dict] = {}

    for result in dense_results:
        chunk_id = result["id"]
        scores[chunk_id] = scores.get(chunk_id, 0.0) + _rrf_score(result["dense_rank"])
        chunk_by_id[chunk_id] = result

    for result in sparse_results:
        chunk_id = result["id"]
        scores[chunk_id] = scores.get(chunk_id, 0.0) + _rrf_score(result["sparse_rank"])
        if chunk_id not in chunk_by_id:
            chunk_by_id[chunk_id] = result

    # Sort by combined RRF score descending
    sorted_ids = sorted(scores, key=lambda k: scores[k], reverse=True)

    return [
        {**chunk_by_id[chunk_id], "rrf_score": scores[chunk_id]}
        for chunk_id in sorted_ids[:final_top_k]
    ]
