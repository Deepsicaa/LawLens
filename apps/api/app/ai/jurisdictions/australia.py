from app.ai.jurisdictions.base import JurisdictionConfig

AUSTRALIA = JurisdictionConfig(
    name="Australia",
    country_code="AU",
    qdrant_collection="australia_legislation",
    citation_format="{source} {year} (Cth), s {section}",
    source_url_pattern="https://www.legislation.gov.au/Details/{act_id}",
    system_prompt_suffix=(
        "You are answering a question about Australian law. "
        "Australia operates under a federal system with Commonwealth (federal) law and "
        "state/territory laws. Commonwealth law prevails in cases of inconsistency. "
        "Cite Commonwealth legislation as: '[Act Name] [Year] (Cth)'. "
        "The Australian Constitution establishes the federal system and is the supreme law. "
        "Common law and equity are also important sources of Australian law."
    ),
    primary_sources=[
        "https://www.legislation.gov.au",
        "https://www.austlii.edu.au",
    ],
)
