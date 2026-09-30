const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Stock Analysis Route
app.get('/api/analyze/:symbol', async (req, res) => {
    const symbol = req.params.symbol;
    const apiKey = process.env.TWELVE_DATA_API_KEY;

    try {
        const response = await axios.get(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`);
        const data = response.data;

        // Perform analysis logic
        const change = parseFloat(data.percent_change);
        let suggestion = "HOLD";
        if (change > 2.0) suggestion = "SELL (Overbought)";
        if (change < -2.0) suggestion = "BUY (Oversold)";

        res.json({ ...data, ai_suggestion: suggestion });
    } catch (error) {
        res.status(500).json({ error: "Analysis engine failed" });
    }
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));