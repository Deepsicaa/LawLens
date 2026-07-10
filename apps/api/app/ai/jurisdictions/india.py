from app.ai.jurisdictions.base import JurisdictionConfig

INDIA = JurisdictionConfig(
    name="India",
    country_code="IN",
    qdrant_collection="india_legislation",
    citation_format="{source}, {section}",
    source_url_pattern="https://indiacode.nic.in/handle/123456789/{doc_id}",
    system_prompt_suffix=(
        "You are answering a question about Indian law. "
        "Indian law is based on statutes enacted by Parliament and state legislatures, "
        "constitutional provisions, and judicial precedents from the Supreme Court of India. "
        "Cite acts by their full name and section number (e.g., 'Indian Penal Code, Section 302'). "
        "The Constitution of India is the supreme law. "
        "Refer to the Bharatiya Nyaya Sanhita (BNS) for criminal law — it replaced the IPC in 2024."
    ),
    primary_sources=[
        "https://indiacode.nic.in",
        "https://legislative.gov.in",
        "https://main.sci.gov.in",
    ],
)
