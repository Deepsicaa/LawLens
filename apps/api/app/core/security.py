"""Clerk JWT verification middleware."""

from __future__ import annotations

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

# Public routes that don't require auth
PUBLIC_PATHS = {
    "/health",
    "/docs",
    "/redoc",
    "/openapi.json",
    "/api/v1/webhooks/clerk",
}


class ClerkAuthMiddleware(BaseHTTPMiddleware):
    """
    Verifies Clerk session token and injects user_id into request.state.
    Routes in PUBLIC_PATHS are bypassed.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        if request.url.path in PUBLIC_PATHS or not request.url.path.startswith("/api/"):
            return await call_next(request)

        # Extract token from Authorization header or __session cookie
        token = None
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
        else:
            token = request.cookies.get("__session")

        if token:
            user_id = await _verify_clerk_token(token)
            request.state.user_id = user_id
        else:
            request.state.user_id = None

        return await call_next(request)


async def _verify_clerk_token(token: str) -> str | None:
    """Verify Clerk JWT and return user_id, or None if invalid."""
    try:
        from clerk_backend_api.security.types import VerifyTokenOptions
        from clerk_backend_api.security.verifytoken import verify_token_async

        from app.core.config import settings

        claims = await verify_token_async(
            token, VerifyTokenOptions(secret_key=settings.CLERK_SECRET_KEY)
        )
        subject = claims.get("sub")
        return subject if isinstance(subject, str) else None
    except Exception:
        return None
