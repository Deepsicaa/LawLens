from datetime import datetime
from uuid import UUID, uuid4
from sqlmodel import SQLModel, Field


class Citation(SQLModel, table=True):
    __tablename__ = "citations"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    message_id: UUID = Field(foreign_key="messages.id", index=True)
    source: str        # e.g. "Indian Penal Code"
    section: str       # e.g. "Section 302"
    text: str          # Exact legislation text
    url: str | None = None
    jurisdiction: str
    relevance_score: float
    created_at: datetime = Field(default_factory=datetime.utcnow)
