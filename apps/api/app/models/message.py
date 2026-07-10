from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field


class Message(SQLModel, table=True):
    __tablename__ = "messages"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    conversation_id: UUID = Field(foreign_key="conversations.id", index=True)
    role: str  # user | assistant
    content: str
    confidence_score: float | None = None
    has_unsupported_claims: bool = Field(default=False)
    processing_time_ms: int | None = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
