from app.ai.jurisdictions.base import JurisdictionConfig

UK = JurisdictionConfig(
    name="United Kingdom",
    country_code="GB",
    qdrant_collection="uk_legislation",
    citation_format="{source} {year}, {section}",
    source_url_pattern="https://www.legislation.gov.uk/{doc_type}/{year}/{number}",
    system_prompt_suffix=(
        "You are answering a question about United Kingdom law. "
        "UK law includes Acts of Parliament, Statutory Instruments, and devolved legislation "
        "for Scotland, Wales, and Northern Ireland. "
        "Primary legislation takes precedence over secondary legislation. "
        "Cite as: '[Act Name] [Year], s [section number]'. "
        "Common law and judicial precedent (case law) are also significant sources of UK law."
    ),
    primary_sources=[
        "https://www.legislation.gov.uk",
        "https://www.gov.uk/guidance/public-sector-information-copyright-and-re-use",
    ],
)
