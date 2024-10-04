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

        // Log the entire response to debug
        console.log('API Response:', response.data);

        // Validate that 'Time Series (5min)' exists in the response data
        const data = response.data['Time Series (5min)'];
        if (!data) {
            return res.status(500).json({
                message: "No time series data found in response."
            });
        }
        
        // Proceed to extract close values
        Object.keys(data).forEach(timestamp => {
            const closeValue = parseFloat(data[timestamp]['4. close']);
            closeValues.push(closeValue);
        });

        const finalProfitOrLoss = logic(closeValues);
        console.log('Final Profit or Loss:', finalProfitOrLoss);
        
        res.json({
            message: "check console for report",
            finalProfitOrLoss  // Include the final profit or loss in the response if needed
        });
    } catch (err) {
        console.error('Error fetching data:', err); 
        res.status(500).json({
            message: "something went wrong" 
        });
    }
});

app.use('/api/v1', Router1);

app.listen(config.server.port, () => {
    console.log(`Server is running on port ${config.server.port}`);
});
