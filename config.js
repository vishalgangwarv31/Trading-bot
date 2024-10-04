//this is example config file

const config = {
    api: {
        baseURL: 'https://www.alphavantage.co/query',
        key: 'example', 
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
