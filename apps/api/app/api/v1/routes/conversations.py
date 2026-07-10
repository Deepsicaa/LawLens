"""
/api/v1/conversations — Conversation history CRUD.
"""
from __future__ import annotations

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.database import get_session
from app.models.conversation import Conversation
from app.models.message import Message
from app.models.citation import Citation
from app.schemas.conversation import ConversationOut, ConversationDetailOut, MessageOut
from app.schemas.legal import CitationOut

router = APIRouter()
Session = Annotated[AsyncSession, Depends(get_session)]


def _get_user_id(request: Request) -> str:
    user_id: str | None = getattr(request.state, "user_id", None)
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return user_id


@router.get("/", response_model=list[ConversationOut])
async def list_conversations(
    request: Request,
    session: Session,
) -> list[ConversationOut]:
    """List the authenticated user's conversations, newest first."""
    user_id = _get_user_id(request)

    result = await session.execute(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())  # type: ignore[arg-type]
        .limit(100)
    )
    convs = result.scalars().all()

    # Count messages per conversation
    output = []
    for conv in convs:
        msg_result = await session.execute(
            select(Message).where(Message.conversation_id == conv.id)
        )
        msg_count = len(msg_result.scalars().all())
        output.append(
            ConversationOut(
                id=conv.id,
                title=conv.title,
                jurisdiction=conv.jurisdiction,
                message_count=msg_count,
                created_at=conv.created_at,
                updated_at=conv.updated_at,
            )
        )
    return output


@router.get("/{conversation_id}", response_model=ConversationDetailOut)
async def get_conversation(
    conversation_id: UUID,
    request: Request,
    session: Session,
) -> ConversationDetailOut:
    """Get a conversation with all messages and citations."""
    user_id = _get_user_id(request)

    conv = await session.get(Conversation, conversation_id)
    if not conv or conv.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    # Load messages
    msg_result = await session.execute(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)  # type: ignore[arg-type]
    )
    messages = msg_result.scalars().all()

    # Load citations for each assistant message
    messages_out = []
    for msg in messages:
        citations: list[CitationOut] = []
        if msg.role == "assistant":
            cit_result = await session.execute(
                select(Citation).where(Citation.message_id == msg.id)
            )
            for c in cit_result.scalars().all():
                citations.append(
                    CitationOut(
                        id=str(c.id),
                        source=c.source,
                        section=c.section,
                        text=c.text,
                        url=c.url,
                        jurisdiction=c.jurisdiction,
                        relevanceScore=c.relevance_score,
                    )
                )
        messages_out.append(
            MessageOut(
                id=msg.id,
                role=msg.role,
                content=msg.content,
                confidence_score=msg.confidence_score,
                has_unsupported_claims=msg.has_unsupported_claims,
                citations=citations,
                created_at=msg.created_at,
            )
        )

    return ConversationDetailOut(
        id=conv.id,
        title=conv.title,
        jurisdiction=conv.jurisdiction,
        message_count=len(messages),
        created_at=conv.created_at,
        updated_at=conv.updated_at,
        messages=messages_out,
    )


@router.delete("/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: UUID,
    request: Request,
    session: Session,
) -> None:
    """Delete a conversation and all its messages (cascade)."""
    user_id = _get_user_id(request)

    conv = await session.get(Conversation, conversation_id)
    if not conv or conv.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found")

    await session.delete(conv)
    await session.commit()
