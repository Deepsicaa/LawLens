"""
/api/v1/legal — Legal query and comparison endpoints.
"""
from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.cache import check_rate_limit
from app.schemas.legal import (
    LegalQueryRequest,
    LegalQueryResponse,
    CompareQueryRequest,
    CompareQueryResponse,
)
from app.services.legal_service import handle_legal_query, handle_compare_query

router = APIRouter()

Session = Annotated[AsyncSession, Depends(get_session)]


def _get_user_id(request: Request) -> str:
    """Extract Clerk user ID from request state (set by auth middleware)."""
    user_id: str | None = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user_id


@router.post("/query", response_model=LegalQueryResponse)
async def query_legal(
    body: LegalQueryRequest,
    request: Request,
    session: Session,
) -> LegalQueryResponse:
    """
    Ask a legal question with jurisdiction-aware RAG.

    Pipeline: Route → Preprocess → Retrieve (hybrid) → Rerank → Generate → Verify → Cite → Score
    """
    user_id = _get_user_id(request)

    # Rate limit: 20 queries per minute per user
    allowed = await check_rate_limit(user_id, "legal_query", limit=20)
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Rate limit exceeded. Maximum 20 queries per minute.",
        )

    return await handle_legal_query(
        question=body.question,
        jurisdiction=body.jurisdiction,
        user_id=user_id,
        conversation_id=body.conversation_id,
        session=session,
    )


@router.post("/compare", response_model=CompareQueryResponse)
async def compare_jurisdictions(
    body: CompareQueryRequest,
    request: Request,
    session: Session,
) -> CompareQueryResponse:
    """
    Compare a legal topic across multiple jurisdictions in parallel.
    Runs the full RAG pipeline for each jurisdiction concurrently.
    """
    user_id = _get_user_id(request)

    # Validate jurisdictions
    valid = {"india", "uk", "canada", "australia"}
    invalid = [j for j in body.jurisdictions if j not in valid]
    if invalid:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=f"Invalid jurisdictions: {invalid}. Valid: {list(valid)}",
        )

    return await handle_compare_query(
        question=body.question,
        jurisdictions=body.jurisdictions,
        user_id=user_id,
        session=session,
    )
