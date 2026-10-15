require('dotenv').config();
const express = require('express');
const evaluateRoutes = require('./routes/evaluate');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', service: 'sop-rag-judge' });
});

app.use('/', evaluateRoutes);

app.listen(PORT, () => {
    console.log(`[System] SOP RAG Judge API running on port ${PORT}`);
});
