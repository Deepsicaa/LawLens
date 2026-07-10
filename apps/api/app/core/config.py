from pathlib import Path
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

# Resolve .env from monorepo root regardless of working directory
_HERE = Path(__file__).resolve().parent          # app/core/
_API_DIR = _HERE.parent.parent                   # apps/api/
_ROOT_ENV = _API_DIR.parent.parent / ".env"      # LawLens/.env
_LOCAL_ENV = _API_DIR / ".env"                   # apps/api/.env (optional override)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(_ROOT_ENV, _LOCAL_ENV),         # root first, local overrides
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ─── App ──────────────────────────────────────────────────────────────────
    ENV: str = "development"
    APP_URL: str = "http://localhost:3000"
    API_URL: str = "http://localhost:8000"
    SECRET_KEY: str = Field(default="dev-secret-change-in-production")

    # ─── Database ─────────────────────────────────────────────────────────────
    DATABASE_URL: str = Field(
        default="postgresql+asyncpg://lawlens:lawlens@localhost:5432/lawlens"
    )
    DATABASE_URL_SYNC: str = Field(
        default="postgresql://lawlens:lawlens@localhost:5432/lawlens"
    )

    # ─── Cache ────────────────────────────────────────────────────────────────
    REDIS_URL: str = "redis://localhost:6379"

    # ─── Vector Database ──────────────────────────────────────────────────────
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: str = ""

    # ─── AI ───────────────────────────────────────────────────────────────────
    OPENROUTER_API_KEY: str = ""          # Routes to any LLM via OpenAI-compatible API
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    VOYAGE_API_KEY: str = ""              # Legal-specific embeddings (no OR equivalent)
    COHERE_API_KEY: str = ""              # Cross-encoder reranking (no OR equivalent)

    # ─── Auth ─────────────────────────────────────────────────────────────────
    CLERK_SECRET_KEY: str = ""
    CLERK_WEBHOOK_SECRET: str = ""

    # ─── Storage ──────────────────────────────────────────────────────────────
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # ─── Embeddings ───────────────────────────────────────────────────────────
    EMBEDDING_MODEL: str = "voyage-law-2"
    EMBEDDING_DIMENSIONS: int = 1024

    # ─── Jurisdictions ────────────────────────────────────────────────────────
    ENABLED_JURISDICTIONS: str = "india,uk,canada,australia"

    # ─── Computed Properties ──────────────────────────────────────────────────

    @property
    def enabled_jurisdictions_list(self) -> list[str]:
        return [j.strip() for j in self.ENABLED_JURISDICTIONS.split(",")]

    @property
    def cors_origins(self) -> list[str]:
        origins = [self.APP_URL]
        if self.ENV == "development":
            origins.extend(["http://localhost:3000", "http://localhost:3001"])
        return origins

    @property
    def is_production(self) -> bool:
        return self.ENV == "production"


settings = Settings()
