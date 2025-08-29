const express = require('express');
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 10000;

app.get('/', (req, res) => {
    res.send('TradingView Alarm Relay System - Working!');
});

app.post('/webhook/tradingview', (req, res) => {
    console.log('Webhook received:', req.body);
    res.json({ success: true, message: 'Webhook received' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
