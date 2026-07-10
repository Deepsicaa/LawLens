"""Sparse BM25 retrieval for exact-match keyword search."""
from __future__ import annotations

import asyncio
from functools import lru_cache

from rank_bm25 import BM25Okapi
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import ScrollResult

from app.core.config import settings

# In-memory BM25 index per collection. Built once at startup.
_bm25_indexes: dict[str, tuple[BM25Okapi, list[dict]]] = {}
_building: set[str] = set()


def _tokenize(text: str) -> list[str]:
    """Simple whitespace + lowercasing tokenizer for BM25."""
    return text.lower().split()


async def _fetch_all_chunks(collection: str) -> list[dict]:
    """Scroll through all Qdrant payloads to build the BM25 corpus."""
    qdrant = AsyncQdrantClient(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY or None,
    )

    chunks: list[dict] = []
    offset = None

    while True:
        result: ScrollResult = await qdrant.scroll(
            collection_name=collection,
            limit=500,
            offset=offset,
            with_payload=True,
            with_vectors=False,
        )
        points, next_offset = result

        for point in points:
            if point.payload:
                chunks.append(
                    {
                        "id": str(point.id),
                        "text": point.payload.get("text", ""),
                        "source": point.payload.get("source", ""),
                        "section": point.payload.get("section", ""),
                        "section_title": point.payload.get("section_title", ""),
                        "url": point.payload.get("url"),
                        "jurisdiction": point.payload.get("jurisdiction", ""),
                    }
                )

        if next_offset is None:
            break
        offset = next_offset

    await qdrant.close()
    return chunks


async def build_bm25_index(collection: str) -> None:
    """Build and cache the BM25 index for a collection."""
    if collection in _bm25_indexes or collection in _building:
        return

    _building.add(collection)
    try:
        chunks = await _fetch_all_chunks(collection)
        corpus = [_tokenize(c["text"]) for c in chunks]
        _bm25_indexes[collection] = (BM25Okapi(corpus), chunks)
    finally:
        _building.discard(collection)


async def sparse_retrieve(
    query: str,
    collection: str,
    top_k: int = 20,
) -> list[dict]:
    """
    BM25 keyword retrieval against a pre-built in-memory index.
    Falls back to empty list if index not yet built.
    """
    if collection not in _bm25_indexes:
        # Build index on first call (blocking for this collection only)
        await build_bm25_index(collection)

    if collection not in _bm25_indexes:
        return []

    bm25, chunks = _bm25_indexes[collection]
    tokenized_query = _tokenize(query)
    scores = bm25.get_scores(tokenized_query)

    # Get top_k indices by score
    import numpy as np

    top_indices = np.argsort(scores)[::-1][:top_k]

    return [
        {
            **chunks[i],
            "sparse_score": float(scores[i]),
            "sparse_rank": rank + 1,
        }
        for rank, i in enumerate(top_indices)
        if scores[i] > 0  # Only return results with non-zero BM25 score
    ]
