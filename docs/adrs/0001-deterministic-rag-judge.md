# ADR 0001: Deterministic LLM Judge for RAG Hallucination Detection in Well Control

## Status
Accepted

## Context
Generative AI pipelines applied to high-consequence well control standard operating procedures (SOPs) present critical safety risks when models hallucinate pressure limits, pump rates, or valve sequences. Standard vector search (RAG) retrieval can be accurate, but generation layers can still interpolate unsafe assumptions.

## Decision
Implement an air-gapped, zero-temperature "LLM Judge" evaluation layer (`sop-rag-judge`) using a locally hosted reasoning model (`Llama 3.1`). The judge executes strict schema-validated checks comparing generated SOPs directly against retrieved engineering manual contexts.

## Consequences
* **Deterministic Guardrails:** Any procedural step or numerical threshold not grounded in the source text immediately sets `is_safe = false`.
* **Zero Cloud Exposure:** Rig documentation and operational decisions remain strictly on-premise.
* **Audit Trail:** Append-only JSONL logging provides non-repudiation and safety traceability for operational compliance.
