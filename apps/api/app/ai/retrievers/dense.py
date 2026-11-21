"""Dense vector retrieval using Qdrant + voyage-law-2 embeddings."""

from __future__ import annotations

from typing import Any

from qdrant_client import AsyncQdrantClient
from voyageai.client_async import AsyncClient

from app.core.config import settings

_voyage: AsyncClient | None = None
_qdrant: AsyncQdrantClient | None = None


def get_voyage() -> AsyncClient:
    global _voyage
    if _voyage is None:
        _voyage = AsyncClient(api_key=settings.VOYAGE_API_KEY)
    return _voyage


def get_qdrant() -> AsyncQdrantClient:
    global _qdrant
    if _qdrant is None:
        _qdrant = AsyncQdrantClient(
            url=settings.QDRANT_URL,
            api_key=settings.QDRANT_API_KEY or None,
        )
    return _qdrant


async def embed_query(query: str) -> list[float]:
    """Embed a query string using voyage-law-2 query mode."""
    result = await get_voyage().embed(
        [query],
        model=settings.EMBEDDING_MODEL,
        input_type="query",
    )
    return [float(value) for value in result.embeddings[0]]


async def dense_retrieve(
    query: str,
    collection: str,
    top_k: int = 20,
) -> list[dict[str, Any]]:
    """
    Retrieve top_k most similar chunks from Qdrant.
    Returns dicts with text, metadata, and score.
    """
    query_vector = await embed_query(query)

    response = await get_qdrant().query_points(
        collection_name=collection,
        query=query_vector,
        limit=top_k,
        with_payload=True,
        with_vectors=False,
    )

    return [
        {
            "id": str(result.id),
            "text": result.payload.get("text", "") if result.payload else "",
            "source": result.payload.get("source", "") if result.payload else "",
            "section": result.payload.get("section", "") if result.payload else "",
            "section_title": result.payload.get("section_title", "") if result.payload else "",
            "url": result.payload.get("url") if result.payload else None,
            "jurisdiction": result.payload.get("jurisdiction", "") if result.payload else "",
            "dense_score": result.score,
            "dense_rank": i + 1,
        }
        for i, result in enumerate(response.points)
    ]
