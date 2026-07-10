# LawLens — Research Contributions

## Overview

LawLens is designed not just as a product, but as a research artifact. The system makes
concrete contributions to several open problems in legal AI.

---

## Research Questions

### RQ1: Hallucination reduction in legal QA

**Hypothesis**: A retrieve-first pipeline with cross-encoder reranking and secondary verification
reduces hallucination rates significantly compared to direct LLM generation.

**Methodology**:
- Baseline: GPT-4 / Claude answering legal questions directly from memory
- LawLens: Full RAG pipeline with verification
- Evaluation: LegalBench, manually curated legal QA dataset
- Metric: Citation accuracy, factual accuracy, hallucination rate

**Expected contribution**: Empirical data showing retrieval-grounded generation produces
measurably fewer fabricated legal citations than direct generation.

### RQ2: Jurisdiction-aware routing accuracy

**Hypothesis**: A lightweight LLM classifier (Haiku) can route legal queries to the correct
jurisdiction with >95% accuracy when the jurisdiction is mentioned, and >85% when implied.

**Methodology**:
- Test set: 500 queries per jurisdiction, labeled by legal experts
- Metrics: Classification accuracy, confidence calibration

### RQ3: Hybrid retrieval quality for legal text

**Hypothesis**: Hybrid retrieval (dense + BM25 + RRF) outperforms either method alone for
legal document retrieval, particularly for queries containing exact statute references.

**Methodology**:
- Compare: dense-only, BM25-only, hybrid (RRF)
- Legal-specific: queries with section references vs. conceptual queries
- Metrics: NDCG@5, MRR, Recall@10

### RQ4: voyage-law-2 vs. general embeddings

**Hypothesis**: Legal-specific embeddings (voyage-law-2) outperform general-purpose embeddings
(text-embedding-3-large) on legal retrieval tasks.

**Methodology**:
- MTEB legal retrieval subset
- Internal benchmark on Phase 1 jurisdictions

---

## Evaluation Framework

### Automated metrics

```python
# Retrieval quality
ndcg_at_5 = NDCG(retrieved_chunks, ground_truth_relevant, k=5)
mrr = MRR(retrieved_chunks, ground_truth_relevant)

# Answer quality
citation_accuracy = citations_verified / total_citations
hallucination_rate = unsupported_claims / total_claims
confidence_calibration = ECE(predicted_confidence, actual_accuracy)
```

### Human evaluation

- Legal expert review of 100 QA pairs per jurisdiction
- Rubric: Legal accuracy (0-5), Citation accuracy (0-5), Clarity (0-5)

---

## Benchmark Datasets

### Existing

- [LegalBench](https://hazyresearch.stanford.edu/legalbench/) — 162 legal reasoning tasks
- CUAD — Contract understanding (for future contract analysis phase)
- EUR-Lex-Sum — Legal summarization (EU, adaptable)

### LawLens-created

- LawLens-QA-IN: 500 Indian law QA pairs with citations
- LawLens-QA-UK: 500 UK law QA pairs with citations
- LawLens-QA-CA: 500 Canadian law QA pairs with citations
- LawLens-QA-AU: 500 Australian law QA pairs with citations

These will be released as open-source datasets.

---

## Publication Targets

1. **EMNLP / ACL** — "Reducing Hallucinations in Legal AI through Hybrid Retrieval and
   Cross-Encoder Verification" (primary venue)
2. **ICAIL** (International Conference on AI and Law) — Legal AI community
3. **arXiv preprint** — Open access, precedes conference submission

---

## Limitations to Acknowledge

1. **Coverage**: Only statutory law; case law and common law principles not indexed in Phase 1
2. **Recency**: Legislation updates may lag if ingestion is not continuous
3. **Languages**: English-only in Phase 1; India has 22 official languages
4. **Jurisdiction scope**: 4 countries; not all provinces/states covered within those countries
5. **Evaluation bias**: Human evaluators may not be legal experts in all jurisdictions

---

## Future Research Directions

- **Cross-lingual legal retrieval**: Expanding to Hindi, French (Canada), Welsh (UK)
- **Case law integration**: Adding judicial precedents alongside statutory law
- **Legal entity extraction**: Named entity recognition for statutes, sections, cases
- **Temporal reasoning**: Handling "as of [date]" queries with legislation change tracking
- **Multi-hop reasoning**: Answering questions that require reasoning across multiple statutes
