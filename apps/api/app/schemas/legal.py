from __future__ import annotations

from pydantic import BaseModel, Field


class LegalQueryRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=2000)
    jurisdiction: str = Field(..., pattern="^(india|uk|canada|australia)$")
    conversation_id: str | None = None


class CitationOut(BaseModel):
    id: str
    source: str
    section: str
    text: str
    url: str | None
    jurisdiction: str
    relevanceScore: float


class LegalQueryResponse(BaseModel):
    answer: str
    citations: list[CitationOut]
    confidenceScore: float
    jurisdiction: str
    retrievedDocuments: int
    processingTimeMs: int
    hasUnsupportedClaims: bool
    conversationId: str | None = None


class CompareQueryRequest(BaseModel):
    question: str = Field(..., min_length=3, max_length=2000)
    jurisdictions: list[str] = Field(..., min_length=2, max_length=4)


class JurisdictionResult(BaseModel):
    jurisdiction: str
    answer: str
    citations: list[CitationOut]
    confidenceScore: float
    retrievedDocuments: int


class CompareQueryResponse(BaseModel):
    question: str
    results: list[JurisdictionResult]
    processingTimeMs: int
