import assert from "node:assert/strict";
import { searchBundledCorpus } from "../packages/rag/src/local-retrieval";
import { runRAGPipeline } from "../packages/rag/src/pipeline";
import type { Jurisdiction } from "../packages/rag/src/types";

const cases: [Jurisdiction, string, string][] = [
  ["india", "Can I request information from a public authority?", "india-rti-s3"],
  ["india", "Who can claim money after a motor vehicle accident?", "india-mva-s166"],
  ["india", "When must an arrested person see a magistrate?", "india-const-art22"],
  ["uk", "Who must repair the heating in my rented flat?", "uk-lta-s11"],
  ["uk", "Can spouses make a joint application for divorce?", "uk-mca-s1"],
  ["uk", "Can I seek a clean break from maintenance payments?", "uk-mca-s25a"],
  ["canada", "How can I challenge a search or seizure?", "ca-charter-s8-11"],
  ["canada", "How do companies handle my personal information?", "ca-pipeda"],
  ["canada", "What determines the best interests of a child?", "ca-divorce-s16"],
  ["australia", "Which law prevails when state and federal laws conflict?", "au-const-s109"],
  ["australia", "Can a business use misleading advertising?", "au-acl-s18"],
  ["australia", "When is dismissal from work unfair?", "au-fwa-s385"],
];

async function main() {
  let first = 0,
    topThree = 0,
    reciprocalRanks = 0;
  for (const [jurisdiction, question, expected] of cases) {
    const hits = searchBundledCorpus(question, jurisdiction, 3);
    const index = hits.findIndex(
      (hit) => hit.id === expected || hit.id.startsWith(expected + "-chunk")
    );
    console.log(jurisdiction, expected, index < 0 ? "outside top three" : index + 1);
    if (index === 0) first++;
    if (index >= 0) {
      topThree++;
      reciprocalRanks += 1 / (index + 1);
    }
  }
  console.log({ questions: cases.length, first, topThree, mrrAt3: reciprocalRanks / cases.length });
  for (const jurisdiction of new Set(cases.map(([country]) => country))) {
    let finished = false;
    await runRAGPipeline(
      "zxqvplmn",
      jurisdiction,
      { qdrantUrl: "", openRouterApiKey: "" },
      {
        onChunk() {},
        onError(error) {
          throw error;
        },
        onDone(result) {
          assert.equal(result.retrievedDocuments, 0);
          assert.equal(result.citations.length, 0);
          assert.match(result.answer, /insufficient evidence/);
          finished = true;
        },
      }
    );
    assert.ok(finished);
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
