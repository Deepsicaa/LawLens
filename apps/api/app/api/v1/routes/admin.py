"""
/api/v1/admin — Admin-only routes for platform management and analytics.
"""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select, func

from app.core.database import get_session
from app.models.user import User
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.analytics import AnalyticsEvent

router = APIRouter()


class PlatformStats(BaseModel):
    total_users: int
    total_conversations: int
    total_messages: int
    total_queries: int
    jurisdictions_breakdown: dict[str, int]


async def _require_admin(request: Request, session: AsyncSession) -> User:
    user_id: str | None = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    user = await session.get(User, user_id)
    if not user or not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return user


@router.get("/stats", response_model=PlatformStats)
async def get_platform_stats(request: Request) -> PlatformStats:
    """Platform-wide statistics for the admin dashboard."""
    from app.core.database import AsyncSessionLocal

    async with AsyncSessionLocal() as session:
        await _require_admin(request, session)

        # Counts
        total_users = (await session.execute(select(func.count(User.id)))).scalar_one()
        total_conversations = (
            await session.execute(select(func.count(Conversation.id)))
        ).scalar_one()
        total_messages = (await session.execute(select(func.count(Message.id)))).scalar_one()
        total_queries = (
            await session.execute(
                select(func.count(Message.id)).where(Message.role == "user")
            )
        ).scalar_one()

        # Jurisdiction breakdown
        rows = (
            await session.execute(
                select(Conversation.jurisdiction, func.count(Conversation.id)).group_by(
                    Conversation.jurisdiction
                )
            )
        ).all()
        jurisdictions = {row[0]: row[1] for row in rows}

    return PlatformStats(
        total_users=total_users,
        total_conversations=total_conversations,
        total_messages=total_messages,
        total_queries=total_queries,
        jurisdictions_breakdown=jurisdictions,
    )


@router.post("/analytics/event")
async def track_event(
    request: Request,
    event_type: str,
    properties: dict | None = None,
) -> dict[str, str]:
    """Track an analytics event (internal use)."""
    user_id: str | None = getattr(request.state, "user_id", None)

    from app.core.database import AsyncSessionLocal

    async with AsyncSessionLocal() as session:
        event = AnalyticsEvent(
            user_id=user_id,
            event_type=event_type,
            properties=properties or {},
        )
        session.add(event)
        await session.commit()

    return {"status": "ok"}
