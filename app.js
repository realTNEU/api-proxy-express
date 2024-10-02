const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const cors = require('cors');

const app1 = express();
const app2 = express();

app1.use(cors());
app2.use(cors());

app1.use(morgan('dev'));
app2.use(morgan('dev'));

const apiRoutes1 = {
    '/api/ip2whois': {
        target: 'https://api.ip2whois.com/v2', 
        changeOrigin: true,
        pathRewrite: { '^/api/ip2whois': '' }, 
    },
};

const apiRoutes2 = {
    '/api/shodan': {
        target: 'https://api.shodan.io/shodan/host',
        changeOrigin: true,
        pathRewrite: { '^/api/shodan': '' }, 
    },
};

Object.keys(apiRoutes1).forEach((route) => {
    app1.use(route, createProxyMiddleware(apiRoutes1[route]));
});

Object.keys(apiRoutes2).forEach((route) => {
    app2.use(route, createProxyMiddleware(apiRoutes2[route]));
});

const PORT1 = 5000; 
const PORT2 = 5001; 

app1.listen(PORT1, () => {
    console.log(`Proxy server for Service 1 is running on http://localhost:${PORT1}`);
});

app2.listen(PORT2, () => {
    console.log(`Proxy server for Service 2 is running on http://localhost:${PORT2}`);
});

