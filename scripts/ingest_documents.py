#!/usr/bin/env python3
"""
LawLens — Legal Document Ingestion Pipeline

Downloads, chunks, and embeds official legal documents into Qdrant.

Usage:
    uv run python scripts/ingest_documents.py --jurisdiction india
    uv run python scripts/ingest_documents.py --all
    uv run python scripts/ingest_documents.py --jurisdiction uk --source-dir ./data/uk/
"""
import argparse
import asyncio
import json
import sys
from pathlib import Path

# Add parent to path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent.parent / "apps" / "api"))

import httpx
from qdrant_client import AsyncQdrantClient
from qdrant_client.models import Distance, VectorParams, PointStruct
from llama_index.core import Document, SimpleDirectoryReader
from llama_index.core.node_parser import SentenceSplitter
import voyageai

from app.core.config import settings
from app.ai.jurisdictions import REGISTRY, get_jurisdiction

# ─── Config ───────────────────────────────────────────────────────────────────

VOYAGE_CLIENT = voyageai.AsyncClient(api_key=settings.VOYAGE_API_KEY)
BATCH_SIZE = 128  # Voyage AI allows up to 128 texts per batch


# ─── Qdrant Setup ─────────────────────────────────────────────────────────────

async def ensure_collection(client: AsyncQdrantClient, collection: str) -> None:
    """Create Qdrant collection if it doesn't exist."""
    existing = {c.name for c in (await client.get_collections()).collections}
    if collection not in existing:
        await client.create_collection(
            collection_name=collection,
            vectors_config=VectorParams(
                size=settings.EMBEDDING_DIMENSIONS,
                distance=Distance.COSINE,
            ),
        )
        print(f"  ✓ Created collection: {collection}")
    else:
        print(f"  · Collection exists: {collection}")


# ─── Document Loading ─────────────────────────────────────────────────────────

def load_documents_from_directory(source_dir: Path) -> list[Document]:
    """Load all text/markdown/PDF documents from a directory."""
    if not source_dir.exists():
        raise FileNotFoundError(f"Source directory not found: {source_dir}")

    reader = SimpleDirectoryReader(
        input_dir=str(source_dir),
        recursive=True,
        required_exts=[".txt", ".md", ".pdf"],
    )
    docs = reader.load_data()
    print(f"  ✓ Loaded {len(docs)} documents from {source_dir}")
    return docs


def chunk_documents(
    docs: list[Document],
    chunk_size: int,
    chunk_overlap: int,
) -> list[dict]:
    """Split documents into chunks with metadata."""
    splitter = SentenceSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    nodes = splitter.get_nodes_from_documents(docs)

    chunks = []
    for node in nodes:
        metadata = node.metadata or {}
        chunks.append(
            {
                "text": node.get_content(),
                "source": metadata.get("source", metadata.get("file_name", "Unknown")),
                "section": metadata.get("section", ""),
                "section_title": metadata.get("section_title", ""),
                "url": metadata.get("url", ""),
                "act_year": metadata.get("act_year"),
                "chunk_index": metadata.get("chunk_index", 0),
            }
        )

    print(f"  ✓ Produced {len(chunks)} chunks")
    return chunks


# ─── Embedding ─────────────────────────────────────────────────────────────────

async def embed_batch(texts: list[str]) -> list[list[float]]:
    """Embed a batch of texts using voyage-law-2."""
    result = await VOYAGE_CLIENT.embed(
        texts,
        model=settings.EMBEDDING_MODEL,
        input_type="document",
    )
    return result.embeddings


async def embed_all(texts: list[str]) -> list[list[float]]:
    """Embed all texts in batches."""
    embeddings: list[list[float]] = []
    for i in range(0, len(texts), BATCH_SIZE):
        batch = texts[i : i + BATCH_SIZE]
        batch_embeddings = await embed_batch(batch)
        embeddings.extend(batch_embeddings)
        print(f"  · Embedded {min(i + BATCH_SIZE, len(texts))}/{len(texts)} chunks", end="\r")
    print()
    return embeddings


# ─── Upsert ──────────────────────────────────────────────────────────────────

async def upsert_to_qdrant(
    client: AsyncQdrantClient,
    collection: str,
    chunks: list[dict],
    embeddings: list[list[float]],
    jurisdiction: str,
) -> None:
    """Upsert chunks + embeddings into Qdrant."""
    import uuid

    points = [
        PointStruct(
            id=str(uuid.uuid4()),
            vector=embedding,
            payload={**chunk, "jurisdiction": jurisdiction},
        )
        for chunk, embedding in zip(chunks, embeddings, strict=True)
    ]

    # Upsert in batches of 100
    for i in range(0, len(points), 100):
        batch = points[i : i + 100]
        await client.upsert(collection_name=collection, points=batch)
        print(f"  · Upserted {min(i + 100, len(points))}/{len(points)} points", end="\r")
    print()


# ─── Main Pipeline ────────────────────────────────────────────────────────────

async def ingest_jurisdiction(
    jurisdiction_name: str,
    source_dir: Path | None = None,
) -> None:
    config = get_jurisdiction(jurisdiction_name)
    source_dir = source_dir or Path("data") / jurisdiction_name

    print(f"\n{'='*60}")
    print(f"  Ingesting: {config.name} → {config.qdrant_collection}")
    print(f"  Source: {source_dir}")
    print(f"{'='*60}\n")

    qdrant = AsyncQdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY or None)

    print("1. Setting up Qdrant collection...")
    await ensure_collection(qdrant, config.qdrant_collection)

    print("2. Loading documents...")
    docs = load_documents_from_directory(source_dir)

    print("3. Chunking documents...")
    chunks = chunk_documents(docs, config.chunk_size, config.chunk_overlap)

    print("4. Generating embeddings with voyage-law-2...")
    texts = [c["text"] for c in chunks]
    embeddings = await embed_all(texts)

    print("5. Upserting to Qdrant...")
    await upsert_to_qdrant(
        qdrant,
        config.qdrant_collection,
        chunks,
        embeddings,
        jurisdiction_name,
    )

    print(f"\n✅ Done! {len(chunks)} chunks ingested into '{config.qdrant_collection}'\n")
    await qdrant.close()


async def main() -> None:
    parser = argparse.ArgumentParser(description="LawLens document ingestion pipeline")
    parser.add_argument("--jurisdiction", choices=list(REGISTRY), help="Jurisdiction to ingest")
    parser.add_argument("--all", action="store_true", help="Ingest all jurisdictions")
    parser.add_argument("--source-dir", type=Path, help="Override source directory")
    args = parser.parse_args()

    if args.all:
        for j in REGISTRY:
            await ingest_jurisdiction(j)
    elif args.jurisdiction:
        await ingest_jurisdiction(args.jurisdiction, args.source_dir)
    else:
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
