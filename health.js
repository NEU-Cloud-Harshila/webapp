const express = require('express');
const logger = require('./_helpers/logger');

const app = express();
app.use('/healthz', (req,res)=>{
    logger.info("Service is up and running");
    return res.status(200).json({ 
        httpResponseCode: 200,
        message: 'OK' });
}); 
module.exports = app;