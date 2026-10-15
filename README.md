# SOP RAG Judge: LLM Hallucination Evaluator

**An air-gapped, edge-deployed LLM evaluation pipeline designed to deterministically intercept and block AI hallucinations in well control standard operating procedures (SOPs).**

---
## 🏗️ System Architecture
*   **`/docs/adrs/`**: Architecture Decision Records detailing compliance strategies.
*   **`/src/routes/`**: API boundary receiving the generated response and source context.
*   **`/src/services/`**: The local LangChain evaluation engine (Llama 3.1).
*   **`/logs/`**: Append-only JSONL audit trails for compliance tracking.
