const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(morgan('dev'));

const apiRoutes = {
  '/api/ip2whois': {
    target: 'https://api.ip2whois.com/v2',
    changeOrigin: true,
    pathRewrite: { '^/api/ip2whois': '' },
  },
  '/api/shodan': {
    target: 'https://api.shodan.io/shodan/host',
    changeOrigin: true,
    pathRewrite: { '^/api/shodan': '' },
  },  
  '/api/ssl': {
    target: 'https://ssl-certificate-checker2.p.rapidapi.com/ssl-certificate-checker/check',
    changeOrigin: true,
    pathRewrite: { '^/api/ssl': '' },
    headers: {
        "x-rapidapi-key": "facc61e5b8msh4021d32a5208244p1ecde7jsnc6676ad1119f",
        "x-rapidapi-host": "ssl-certificate-checker2.p.rapidapi.com",
    }
  }
};

Object.keys(apiRoutes).forEach((route) => {
  app.use(route, createProxyMiddleware(apiRoutes[route]));
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Proxy server is running on http://localhost:${PORT}`);
});