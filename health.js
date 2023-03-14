const express = require('express');

const app = express();
app.use('/healthz', (req,res)=>{
    return res.status(200).json({ 
        httpResponseCode: 200,
        message: 'OK' });
}); 
module.exports = app;