"""
Legal query service — orchestrates the RAG pipeline and persists results to PostgreSQL.
"""
from __future__ import annotations

import asyncio
import uuid
from datetime import datetime

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.pipeline.graph import run_pipeline
from app.core.cache import get_cached_query, set_cached_query, make_query_cache_key
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.citation import Citation
from app.schemas.legal import LegalQueryResponse, CitationOut, CompareQueryResponse, JurisdictionResult


async def handle_legal_query(
    *,
    question: str,
    jurisdiction: str,
    user_id: str,
    conversation_id: str | None = None,
    session: AsyncSession,
) -> LegalQueryResponse:
    """
    1. Check cache
    2. Run the RAG pipeline
    3. Persist conversation + message + citations to PostgreSQL
    4. Cache the result
    5. Return response
    """
    # Cache check
    cache_key = make_query_cache_key(question, jurisdiction)
    cached = await get_cached_query(cache_key)
    if cached and not conversation_id:
        # Return cached result for identical queries (no conversation context)
        return LegalQueryResponse(**cached)

    # Run pipeline
    final_state = await run_pipeline(
        question=question,
        jurisdiction=jurisdiction,
        conversation_id=conversation_id,
    )

    # Build citations output
    citations_out = [
        CitationOut(
            id=c.get("id", str(uuid.uuid4())),
            source=c.get("source", ""),
            section=c.get("section", ""),
            text=c.get("text", ""),
            url=c.get("url"),
            jurisdiction=c.get("jurisdiction", jurisdiction),
            relevanceScore=c.get("relevanceScore", 0.0),
        )
        for c in (final_state.get("citations") or [])
    ]

    # Persist to database
    conv_id = await _persist_to_db(
        question=question,
        answer=final_state.get("answer", ""),
        jurisdiction=jurisdiction,
        user_id=user_id,
        conversation_id=conversation_id,
        confidence_score=final_state.get("confidence_score", 0.0),
        has_unsupported_claims=final_state.get("has_unsupported_claims", False),
        citations=citations_out,
        session=session,
    )

    response = LegalQueryResponse(
        answer=final_state.get("answer", "Unable to generate an answer."),
        citations=citations_out,
        confidenceScore=final_state.get("confidence_score", 0.0),
        jurisdiction=final_state.get("jurisdiction", jurisdiction),
        retrievedDocuments=len(final_state.get("reranked_chunks") or []),
        processingTimeMs=final_state.get("processing_time_ms", 0),
        hasUnsupportedClaims=final_state.get("has_unsupported_claims", False),
        conversationId=str(conv_id) if conv_id else None,
    )

    # Cache (only non-conversation queries)
    if not conversation_id:
        await set_cached_query(cache_key, response.model_dump())

    return response


async def handle_compare_query(
    *,
    question: str,
    jurisdictions: list[str],
    user_id: str,
    session: AsyncSession,
) -> CompareQueryResponse:
    """Run the pipeline in parallel across multiple jurisdictions."""
    import time
    start = time.monotonic()

    tasks = [
        run_pipeline(question=question, jurisdiction=j)
        for j in jurisdictions
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)

    jurisdiction_results: list[JurisdictionResult] = []
    for j, result in zip(jurisdictions, results):
        if isinstance(result, Exception):
            jurisdiction_results.append(
                JurisdictionResult(
                    jurisdiction=j,
                    answer=f"Error retrieving results for {j}: {result}",
                    citations=[],
                    confidenceScore=0.0,
                    retrievedDocuments=0,
                )
            )
        else:
            citations_out = [
                CitationOut(
                    id=c.get("id", str(uuid.uuid4())),
                    source=c.get("source", ""),
                    section=c.get("section", ""),
                    text=c.get("text", ""),
                    url=c.get("url"),
                    jurisdiction=c.get("jurisdiction", j),
                    relevanceScore=c.get("relevanceScore", 0.0),
                )
                for c in (result.get("citations") or [])
            ]
            jurisdiction_results.append(
                JurisdictionResult(
                    jurisdiction=j,
                    answer=result.get("answer", ""),
                    citations=citations_out,
                    confidenceScore=result.get("confidence_score", 0.0),
                    retrievedDocuments=len(result.get("reranked_chunks") or []),
                )
            )

    elapsed_ms = int((time.monotonic() - start) * 1000)
    return CompareQueryResponse(
        question=question,
        results=jurisdiction_results,
        processingTimeMs=elapsed_ms,
    )


async def _persist_to_db(
    *,
    question: str,
    answer: str,
    jurisdiction: str,
    user_id: str,
    conversation_id: str | None,
    confidence_score: float,
    has_unsupported_claims: bool,
    citations: list[CitationOut],
    session: AsyncSession,
) -> uuid.UUID:
    """Create or update conversation + persist user/assistant messages."""
    now = datetime.utcnow()

    if conversation_id:
        conv = await session.get(Conversation, uuid.UUID(conversation_id))
        if conv:
            conv.updated_at = now
        else:
            conv = None
    else:
        conv = None

    if conv is None:
        # Auto-generate title from first 60 chars of question
        title = question[:60].rstrip() + ("…" if len(question) > 60 else "")
        conv = Conversation(
            user_id=user_id,
            title=title,
            jurisdiction=jurisdiction,
            created_at=now,
            updated_at=now,
        )
        session.add(conv)
        await session.flush()

    # User message
    user_msg = Message(
        conversation_id=conv.id,
        role="user",
        content=question,
        created_at=now,
    )
    session.add(user_msg)
    await session.flush()

    # Assistant message
    assistant_msg = Message(
        conversation_id=conv.id,
        role="assistant",
        content=answer,
        confidence_score=confidence_score,
        has_unsupported_claims=has_unsupported_claims,
        created_at=now,
    )
    session.add(assistant_msg)
    await session.flush()

    # Citations
    for c in citations:
        citation = Citation(
            message_id=assistant_msg.id,
            source=c.source,
            section=c.section,
            text=c.text,
            url=c.url,
            jurisdiction=c.jurisdiction,
            relevance_score=c.relevanceScore,
            created_at=now,
        )
        session.add(citation)

    await session.commit()
    return conv.id
