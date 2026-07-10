from app.ai.jurisdictions.base import JurisdictionConfig
from app.ai.jurisdictions.india import INDIA
from app.ai.jurisdictions.uk import UK
from app.ai.jurisdictions.canada import CANADA
from app.ai.jurisdictions.australia import AUSTRALIA

REGISTRY: dict[str, JurisdictionConfig] = {
    "india": INDIA,
    "uk": UK,
    "canada": CANADA,
    "australia": AUSTRALIA,
}


def get_jurisdiction(name: str) -> JurisdictionConfig:
    if name not in REGISTRY:
        raise ValueError(f"Unknown jurisdiction: {name!r}. Available: {list(REGISTRY)}")
    return REGISTRY[name]
