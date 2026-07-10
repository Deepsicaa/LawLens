"""
/api/v1/webhooks/clerk — Sync Clerk users to PostgreSQL on sign-up/update.
"""
from __future__ import annotations

import hmac
import hashlib

from fastapi import APIRouter, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_session
from app.models.user import User

router = APIRouter()


def _verify_clerk_signature(payload: bytes, svix_signature: str, svix_timestamp: str) -> bool:
    """Verify Clerk webhook signature using HMAC-SHA256."""
    if not settings.CLERK_WEBHOOK_SECRET:
        return True  # Skip in development if secret not set

    signed_content = f"{svix_timestamp}.{payload.decode('utf-8')}"
    secret = settings.CLERK_WEBHOOK_SECRET.removeprefix("whsec_")

    import base64
    key = base64.b64decode(secret)
    expected = hmac.new(key, signed_content.encode(), hashlib.sha256).digest()
    expected_b64 = base64.b64encode(expected).decode()

    # Clerk sends comma-separated list of signatures; check any match
    return any(sig == f"v1,{expected_b64}" for sig in svix_signature.split(" "))


@router.post("/clerk")
async def clerk_webhook(request: Request) -> dict[str, str]:
    """Handle Clerk webhook events to sync users to our database."""
    payload = await request.body()
    svix_id = request.headers.get("svix-id", "")
    svix_timestamp = request.headers.get("svix-timestamp", "")
    svix_signature = request.headers.get("svix-signature", "")

    if not _verify_clerk_signature(payload, svix_signature, svix_timestamp):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid signature")

    import json
    data = json.loads(payload)
    event_type = data.get("type", "")
    user_data = data.get("data", {})

    async with AsyncSession(bind=None) as session:  # type: ignore[call-arg]
        from app.core.database import engine
        from sqlalchemy.ext.asyncio import AsyncSession as AS
        async with AS(bind=engine) as db:
            if event_type in ("user.created", "user.updated"):
                await _upsert_user(user_data, db)
            elif event_type == "user.deleted":
                await _delete_user(user_data.get("id", ""), db)

    return {"status": "ok"}


async def _upsert_user(data: dict, session: AsyncSession) -> None:
    user_id = data.get("id", "")
    if not user_id:
        return

    primary_email = ""
    for email_obj in data.get("email_addresses", []):
        if email_obj.get("id") == data.get("primary_email_address_id"):
            primary_email = email_obj.get("email_address", "")
            break

    existing = await session.get(User, user_id)
    if existing:
        existing.email = primary_email
        existing.name = f"{data.get('first_name', '')} {data.get('last_name', '')}".strip() or None
        existing.image_url = data.get("image_url")
    else:
        user = User(
            id=user_id,
            email=primary_email,
            name=f"{data.get('first_name', '')} {data.get('last_name', '')}".strip() or None,
            image_url=data.get("image_url"),
        )
        session.add(user)
    await session.commit()


async def _delete_user(user_id: str, session: AsyncSession) -> None:
    user = await session.get(User, user_id)
    if user:
        await session.delete(user)
        await session.commit()
