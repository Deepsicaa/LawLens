from app.ai.jurisdictions.base import JurisdictionConfig

CANADA = JurisdictionConfig(
    name="Canada",
    country_code="CA",
    qdrant_collection="canada_legislation",
    citation_format="{source}, RSC {year}, c {chapter}, s {section}",
    source_url_pattern="https://laws-lois.justice.gc.ca/eng/acts/{act_code}/page-{page}.html",
    system_prompt_suffix=(
        "You are answering a question about Canadian law. "
        "Canada has a bijural legal system: common law in most provinces, civil law in Quebec. "
        "Federal law applies nationwide; provincial law applies within each province. "
        "Cite federal statutes as: '[Act Name], RSC [year], c [chapter]'. "
        "The Canadian Charter of Rights and Freedoms is part of the Constitution Act, 1982 "
        "and takes precedence over all other legislation."
    ),
    primary_sources=[
        "https://laws-lois.justice.gc.ca",
        "https://www.canada.ca/en/services/law.html",
    ],
)
