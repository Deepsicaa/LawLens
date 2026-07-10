from __future__ import annotations

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.schemas.legal import CitationOut


class MessageOut(BaseModel):
    id: UUID
    role: str
    content: str
    confidence_score: float | None
    has_unsupported_claims: bool
    citations: list[CitationOut] = []
    created_at: datetime


class ConversationOut(BaseModel):
    id: UUID
    title: str
    jurisdiction: str
    message_count: int
    created_at: datetime
    updated_at: datetime


class ConversationDetailOut(ConversationOut):
    messages: list[MessageOut]
