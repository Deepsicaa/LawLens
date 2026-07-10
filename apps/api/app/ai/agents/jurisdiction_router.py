"""Jurisdiction Router — classifies which country's law applies to a query."""
from __future__ import annotations

import json

from app.ai.llm import complete, HAIKU
from app.ai.pipeline.state import PipelineState
from app.core.config import settings

ROUTING_SYSTEM = """You are a legal jurisdiction classifier.

Given a user's legal question, determine which country's law is most relevant.

Supported jurisdictions:
- india: Questions about Indian law, Indian Penal Code, Indian Constitution, Indian statutes
- uk: Questions about UK/British/English/Scottish/Welsh law, Acts of Parliament
- canada: Questions about Canadian law, federal or provincial
- australia: Questions about Australian law, Commonwealth or state law

Return a JSON object with:
{
  "jurisdiction": "india" | "uk" | "canada" | "australia",
  "confidence": 0.0 to 1.0,
  "reasoning": "brief explanation"
}

If the question explicitly names a jurisdiction, set confidence to 0.95+.
If it's ambiguous or doesn't mention a specific country, set confidence < 0.7.
Return ONLY the JSON object, nothing else."""


async def route_jurisdiction(state: PipelineState) -> PipelineState:
    """
    Use Claude Haiku to classify the jurisdiction of the query.
    If confidence is low and no jurisdiction was pre-selected, flag for clarification.
    """
    question = state["question"]
    # If jurisdiction was explicitly provided by the user, trust it
    if state.get("jurisdiction") in settings.enabled_jurisdictions_list:
        return {
            **state,
            "jurisdiction_confidence": 1.0,
            "jurisdiction_needs_clarification": False,
        }

    response = await complete(
        system=ROUTING_SYSTEM,
        messages=[{"role": "user", "content": question}],
        model=HAIKU,
        max_tokens=256,
        temperature=0,
    )

    try:
        # Strip markdown fences if present
        clean = response.strip().removeprefix("```json").removesuffix("```").strip()
        data = json.loads(clean)
        jurisdiction = data.get("jurisdiction", "india")
        confidence = float(data.get("confidence", 0.5))
    except (json.JSONDecodeError, ValueError):
        # Fall back to first enabled jurisdiction
        jurisdiction = settings.enabled_jurisdictions_list[0]
        confidence = 0.5

    # Clamp confidence
    confidence = max(0.0, min(1.0, confidence))
    needs_clarification = confidence < 0.65 and not state.get("jurisdiction")

    return {
        **state,
        "jurisdiction": jurisdiction,
        "jurisdiction_confidence": confidence,
        "jurisdiction_needs_clarification": needs_clarification,
        "answer": (
            f"Your question seems to span multiple jurisdictions. "
            f"Could you clarify which country's law you're asking about? "
            f"(India, UK, Canada, or Australia)"
        )
        if needs_clarification
        else state.get("answer", ""),
    }
