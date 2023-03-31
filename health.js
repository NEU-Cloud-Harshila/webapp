const express = require('express');
const logger = require('./_helpers/logger');
const StatsD = require('node-statsd');
const client = new StatsD();

const app = express();
app.use('/healthz', (req,res)=>{
    client.increment('Healthz');
    logger.info("Service is up and running");
    return res.status(200).json({ 
        httpResponseCode: 200,
        message: 'OK' });
}); 
module.exports = app;