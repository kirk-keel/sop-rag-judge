const { ChatOllama } = require("@langchain/ollama");
const { PromptTemplate } = require("@langchain/core/prompts");
const { StructuredOutputParser } = require("@langchain/core/output_parsers");
const { z } = require("zod");
const { logJudgeDecision } = require('../utils/logger');

const outputParser = StructuredOutputParser.fromZodSchema(
    z.object({
        is_safe: z.boolean().describe("True if the generated SOP contains ZERO hallucinations and strictly follows the context."),
        hallucinations_found: z.array(z.string()).describe("List of any facts, numbers, or steps present in the SOP that do not exist in the source context."),
        confidence_score: z.number().min(0).max(100),
        explanation: z.string().describe("Engineering justification for the pass/fail grade.")
    })
);

async function evaluateSopAsync(data) {
    console.log(`[Judge] Auditing SOP generation for ${data.metadata.procedure_id} via local homelab...`);

    try {
        const model = new ChatOllama({
            baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
            model: process.env.OLLAMA_MODEL_NAME || "llama3.1",
            temperature: 0.0, // Zero temperature for strict deterministic evaluation
            format: "json",
        });

        const prompt = new PromptTemplate({
            template: `You are an expert Well Control Auditor. 
Your job is to evaluate an AI-generated Standard Operating Procedure (SOP) against the verified Source Context from the engineering manual.

### Operating Rules:
1. The Generated SOP must NOT contain any numbers, pressure limits, or steps that are not explicitly stated in the Source Context.
2. If the Generated SOP invents a fact (hallucination), it fails immediately (is_safe = false).
3. Be brutally strict. Safety is the highest priority.

### Output Instructions:
{format_instructions}

### Payload:
Source Context (Ground Truth): {source_context}
Generated SOP (Under Review): {generated_sop}`,
            inputVariables: ["source_context", "generated_sop"],
            partialVariables: { format_instructions: outputParser.getFormatInstructions() },
        });

        const chain = prompt.pipe(model).pipe(outputParser);
        const result = await chain.invoke({
            source_context: data.source_context,
            generated_sop: data.generated_response
        });

        console.log(`[Judge Result] Safe to Deploy: ${result.is_safe} | Hallucinations: ${result.hallucinations_found.length}`);
        logJudgeDecision(data.metadata, result);
        
        return result;
    } catch (error) {
        console.error("[Judge Error] Failed to process via local model:", error);
    }
}

module.exports = { evaluateSopAsync };
