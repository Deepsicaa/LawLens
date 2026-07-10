import hashlib
import json
from typing import Any

import redis.asyncio as aioredis
from app.core.config import settings

_redis: aioredis.Redis | None = None


def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
        )
    return _redis


def make_query_cache_key(question: str, jurisdiction: str) -> str:
    payload = f"{question.strip().lower()}:{jurisdiction}"
    digest = hashlib.sha256(payload.encode()).hexdigest()[:16]
    return f"query:{digest}"


async def get_cached_query(key: str) -> dict[str, Any] | None:
    r = get_redis()
    raw = await r.get(key)
    if raw is None:
        return None
    return json.loads(raw)  # type: ignore[no-any-return]


async def set_cached_query(key: str, value: dict[str, Any], ttl: int = 3600) -> None:
    r = get_redis()
    await r.setex(key, ttl, json.dumps(value))


async def check_rate_limit(user_id: str, endpoint: str, limit: int = 20) -> bool:
    r = get_redis()
    key = f"rate:{user_id}:{endpoint}"
    count = await r.incr(key)
    if count == 1:
        await r.expire(key, 60)
    return count <= limit
