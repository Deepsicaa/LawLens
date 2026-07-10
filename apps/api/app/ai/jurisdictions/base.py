from dataclasses import dataclass, field


@dataclass(frozen=True)
class JurisdictionConfig:
    name: str
    country_code: str           # ISO 3166-1 alpha-2
    qdrant_collection: str      # Vector collection name
    citation_format: str        # e.g. "{source}, {section}"
    source_url_pattern: str     # Official source URL template
    system_prompt_suffix: str   # Jurisdiction-specific LLM context
    chunk_size: int = 512       # Token target per chunk
    chunk_overlap: int = 64
    primary_sources: list[str] = field(default_factory=list)
