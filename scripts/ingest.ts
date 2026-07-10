#!/usr/bin/env node
/**
 * LawLens — Legal Document Ingestion CLI
 *
 * Usage:
 *   pnpm tsx scripts/ingest.ts                    # ingest all jurisdictions
 *   pnpm tsx scripts/ingest.ts --jurisdiction india
 *   pnpm tsx scripts/ingest.ts --dry-run           # show what would be ingested
 *   pnpm tsx scripts/ingest.ts --count             # show document counts
 *
 * Required environment variables (in .env):
 *   VOYAGE_API_KEY   — Voyage AI (voyage-law-2 embeddings)
 *   QDRANT_URL       — Qdrant vector database URL
 *   QDRANT_API_KEY   — Qdrant API key (optional for local)
 */

import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env from monorepo root
function loadEnv(): void {
  const envPath = resolve(process.cwd(), ".env");
  try {
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, "");
      if (key && !process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env not found; rely on existing process.env
  }
}

loadEnv();

const VALID_JURISDICTIONS = ["india", "uk", "canada", "australia"] as const;
type Jurisdiction = (typeof VALID_JURISDICTIONS)[number];

function parseArgs(): {
  jurisdiction?: Jurisdiction;
  dryRun: boolean;
  countOnly: boolean;
} {
  const args = process.argv.slice(2);
  let jurisdiction: Jurisdiction | undefined;
  let dryRun = false;
  let countOnly = false;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--jurisdiction" && args[i + 1]) {
      const j = args[++i]!.toLowerCase() as Jurisdiction;
      if (!VALID_JURISDICTIONS.includes(j)) {
        console.error(`Invalid jurisdiction: ${j}. Must be one of: ${VALID_JURISDICTIONS.join(", ")}`);
        process.exit(1);
      }
      jurisdiction = j;
    } else if (args[i] === "--dry-run") {
      dryRun = true;
    } else if (args[i] === "--count") {
      countOnly = true;
    }
  }

  return { jurisdiction, dryRun, countOnly };
}

async function main(): Promise<void> {
  const { jurisdiction, dryRun, countOnly } = parseArgs();

  const voyageApiKey = process.env["VOYAGE_API_KEY"] || undefined;
  const qdrantUrl = process.env["QDRANT_URL"] ?? "http://localhost:6333";
  const qdrantApiKey = process.env["QDRANT_API_KEY"] || undefined;
  const ollamaUrl = process.env["OLLAMA_URL"] ?? "http://localhost:11434";

  if (!voyageApiKey) {
    // Verify Ollama is reachable as a fallback
    try {
      const r = await fetch(`${ollamaUrl}/api/tags`);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      console.log("   Embeddings: Ollama (local nomic-embed-text, 768 dims)");
    } catch {
      console.error("Error: VOYAGE_API_KEY is not set and Ollama is not reachable.");
      console.error(`  Voyage AI: https://www.voyageai.com/`);
      console.error(`  Ollama: https://ollama.com/ — run: ollama pull nomic-embed-text`);
      process.exit(1);
    }
  } else {
    console.log("   Embeddings: Voyage AI (voyage-law-2, 1024 dims)");
  }

  // Dynamically import to keep this file standalone-runnable
  const { ingestAll, ingestJurisdiction, countDocuments, createQdrantClient, collectionExists } = await import("../packages/rag/src/index.js");

  const config = {
    ...(voyageApiKey ? { voyageApiKey } : {}),
    qdrantUrl,
    ...(qdrantApiKey ? { qdrantApiKey } : {}),
  };

  if (countOnly) {
    console.log("📊 Document counts in Qdrant:");
    const client = createQdrantClient(qdrantUrl, qdrantApiKey);
    if (!(await collectionExists(client))) {
      console.log("  No collection found. Run ingestion first.");
    } else {
      for (const j of VALID_JURISDICTIONS) {
        const n = await countDocuments(client, j);
        console.log(`  ${j.padEnd(12)} ${n} chunks`);
      }
      const total = await countDocuments(client);
      console.log(`  ${"TOTAL".padEnd(12)} ${total} chunks`);
    }
    return;
  }

  if (dryRun) {
    const { INDIA_DOCUMENTS, UK_DOCUMENTS, CANADA_DOCUMENTS, AUSTRALIA_DOCUMENTS } = await import("../packages/rag/src/index.js");
    const docMap = { india: INDIA_DOCUMENTS, uk: UK_DOCUMENTS, canada: CANADA_DOCUMENTS, australia: AUSTRALIA_DOCUMENTS };
    const targets = jurisdiction ? [jurisdiction] : VALID_JURISDICTIONS;
    console.log("🔍 Dry run — documents that would be ingested:\n");
    for (const j of targets) {
      const docs = docMap[j];
      console.log(`${j.toUpperCase()} (${docs.length} documents):`);
      for (const doc of docs) {
        console.log(`  • ${doc.source} — ${doc.section} (${doc.year})`);
      }
      console.log();
    }
    return;
  }

  console.log("⚖️  LawLens Legal Document Ingestion");
  console.log(`   Qdrant: ${qdrantUrl}`);
  console.log(`   Model:  voyage-law-2 (1024 dimensions)`);
  console.log();

  const onProgress = ({ jurisdiction: j, total, embedded, upserted }: {
    jurisdiction: string; total: number; embedded: number; upserted: number;
  }): void => {
    if (embedded === 0) {
      process.stdout.write(`   ${j.toUpperCase().padEnd(12)} Embedding ${total} chunks...`);
    } else if (upserted === 0) {
      process.stdout.write(` ✓ embedded | Upserting to Qdrant...`);
    } else {
      console.log(` ✓ done (${upserted} chunks upserted)`);
    }
  };

  const startTime = Date.now();

  if (jurisdiction) {
    await ingestJurisdiction(jurisdiction, config, onProgress);
  } else {
    await ingestAll(config, onProgress);
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ Ingestion complete in ${elapsed}s`);
  console.log("   Run with --count to verify document counts.");
}

main().catch((err: unknown) => {
  console.error("Fatal error:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
