const express = require('express');
const { z } = require('zod');
const { evaluateSopAsync } = require('../services/judge');

const router = express.Router();

const evalSchema = z.object({
    metadata: z.object({
        procedure_id: z.string(),
        well_id: z.string(),
        author: z.string()
    }),
    source_context: z.string().min(10).describe("The raw text retrieved from the well control manual"),
    generated_response: z.string().min(10).describe("The AI-generated SOP based on the context")
});

router.post('/api/v1/evaluate', async (req, res) => {
    try {
        const validatedData = evalSchema.parse(req.body);
        evaluateSopAsync(validatedData);

        return res.status(202).json({ 
            status: 'accepted', 
            message: 'SOP queued for LLM Hallucination Audit',
            procedure_id: validatedData.metadata.procedure_id
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ status: 'error', message: 'Invalid schema', issues: error.issues });
        }
        return res.status(500).json({ status: 'error', message: 'Server error' });
    }
});

module.exports = router;
