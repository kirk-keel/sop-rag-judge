const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const auditLogPath = path.join(logDirectory, 'hallucination-audit.jsonl');

function logJudgeDecision(metadata, result) {
    const logEntry = {
        timestamp: new Date().toISOString(),
        procedure_id: metadata.procedure_id,
        model_used: process.env.OLLAMA_MODEL_NAME || 'llama3.1',
        is_safe: result.is_safe,
        hallucinations: result.hallucinations_found,
    };

    fs.appendFile(auditLogPath, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) console.error('[Logger Error] Failed to write log', err);
    });
}

module.exports = { logJudgeDecision };
