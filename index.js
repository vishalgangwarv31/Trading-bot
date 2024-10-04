const express = require('express');
const { Router } = require('express');
const axios = require('axios');
const { logic } = require('./bot');
const config = require('./config'); 

const app = express();
const Router1 = Router();
app.use(express.json());

Router1.get(config.routes.hello, (req, res) => {
    res.json({
        message: "hello world"
    });
});

Router1.get(config.routes.trade, async (req, res) => {
    const closeValues = [];
    try {
        const response = await axios.get(config.api.baseURL, {
            params: {
                function: 'TIME_SERIES_INTRADAY',
                symbol: 'IBM',
                interval: '5min',
                apikey: config.api.key 
            }
        });
        
        const data = response.data['Time Series (5min)'];
        
        Object.keys(data).forEach(timestamp => {
            const closeValue = parseFloat(data[timestamp]['4. close']);
            closeValues.push(closeValue);
        });

        const finalProfitOrLoss = logic(closeValues);
        console.log('Final Profit or Loss:', finalProfitOrLoss);
        
        res.json({
            message : "check console for report"
        });
    } catch (err) {
        console.error(err); 
        res.status(500).json({
            message: "something went wring" 
        });
    }
});

app.use('/api/v1', Router1);

app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
});
