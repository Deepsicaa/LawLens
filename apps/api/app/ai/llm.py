"""OpenRouter LLM client — OpenAI-compatible API gateway supporting any model."""
from __future__ import annotations

from openai import AsyncOpenAI

from app.core.config import settings

_client: AsyncOpenAI | None = None

# Model routing — OpenRouter model IDs
# Fast tasks: jurisdiction routing, verification, query expansion
HAIKU = "anthropic/claude-haiku-4-5"
# Quality tasks: answer generation (best accuracy for legal text)
SONNET = "anthropic/claude-sonnet-4-6"


def get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(
            api_key=settings.OPENROUTER_API_KEY,
            base_url=settings.OPENROUTER_BASE_URL,
            default_headers={
                "HTTP-Referer": settings.APP_URL,
                "X-Title": "LawLens",
            },
        )
    return _client


async def complete(
    system: str,
    messages: list[dict[str, str]],
    model: str = SONNET,
    max_tokens: int = 2048,
    temperature: float = 0.1,
) -> str:
    """Non-streaming completion via OpenRouter."""
    response = await get_client().chat.completions.create(
        model=model,
        max_tokens=max_tokens,
        temperature=temperature,
        messages=[{"role": "system", "content": system}, *messages],  # type: ignore[arg-type]
    )
    return response.choices[0].message.content or ""


async def stream_complete(
    system: str,
    messages: list[dict[str, str]],
    model: str = SONNET,
    max_tokens: int = 2048,
    temperature: float = 0.1,
):
    """Streaming completion — yields text chunks via OpenRouter SSE."""
    stream = await get_client().chat.completions.create(
        model=model,
        max_tokens=max_tokens,
        temperature=temperature,
        messages=[{"role": "system", "content": system}, *messages],  # type: ignore[arg-type]
        stream=True,
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta
