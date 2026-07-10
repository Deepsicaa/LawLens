from datetime import datetime
from uuid import UUID, uuid4
from typing import Any
from sqlmodel import SQLModel, Field
from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB


class AnalyticsEvent(SQLModel, table=True):
    __tablename__ = "analytics_events"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: str | None = Field(default=None, foreign_key="users.id", index=True)
    event_type: str = Field(index=True)
    properties: dict[str, Any] = Field(
        default_factory=dict,
        sa_column=Column(JSONB, nullable=False, server_default="{}"),
    )
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
