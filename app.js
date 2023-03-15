require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_middleware/error-handler');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// api routes
app.use('/healthz', (req,res)=>{
    return res.status(200).json({ 
        httpResponseCode: 200,
        message: 'OK' });
});
app.use('/', require('./users/users.controller'));
app.use('/', require('./products/products.controller'));
app.use('/', require('./images/images.controller'));

// global error handler
app.use(errorHandler);
module.exports = app;