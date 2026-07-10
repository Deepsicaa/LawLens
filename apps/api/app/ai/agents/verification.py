"""
Verification Agent — checks whether the generated answer is supported by the retrieved documents.
Uses Claude Haiku (fast, cheap classification) as a secondary LLM pass.
"""
from __future__ import annotations

import json

from app.ai.llm import complete, HAIKU
from app.ai.pipeline.state import PipelineState

VERIFICATION_SYSTEM = """You are a legal fact-checker for an AI legal research system.

Your job: Given an AI-generated answer and the retrieved source documents, determine whether
every factual claim in the answer is supported by the retrieved documents.

Be strict. If the answer makes ANY claim that goes beyond what's in the documents, flag it.

Return a JSON object:
{
  "has_unsupported_claims": true | false,
  "notes": "brief description of any unsupported claims, or 'All claims verified' if none"
}

Return ONLY the JSON object."""


async def verify_answer(state: PipelineState) -> PipelineState:
    """
    Verify the generated answer against retrieved documents.
    Flags any claims not directly supported by the evidence.
    """
    answer = state.get("raw_answer", "")
    context = state.get("context_text", "")

    if not answer or not context:
        return {
            **state,
            "has_unsupported_claims": False,
            "verification_notes": "No content to verify",
        }

    verification_prompt = f"""Retrieved Documents:
{context[:3000]}

Generated Answer:
{answer}

Does the answer contain any claims not supported by the documents?"""

    response = await complete(
        system=VERIFICATION_SYSTEM,
        messages=[{"role": "user", "content": verification_prompt}],
        model=HAIKU,
        max_tokens=512,
        temperature=0,
    )

    try:
        clean = response.strip().removeprefix("```json").removesuffix("```").strip()
        data = json.loads(clean)
        has_unsupported = bool(data.get("has_unsupported_claims", False))
        notes = str(data.get("notes", ""))
    except (json.JSONDecodeError, ValueError):
        has_unsupported = False
        notes = "Verification parsing error"

    return {
        **state,
        "has_unsupported_claims": has_unsupported,
        "verification_notes": notes,
    }
