// this is demo api 

const config = {
    api: {
        baseURL: 'https://www.alphavantage.co/query', // i didnt found any api which ggives real time data for free
        key: 'demo',  // demo
    },
    server: {
        port: 3000,
    },
    routes: {
        trade: '/trade',
        hello: '/hello',
    }
};

module.exports = config;
