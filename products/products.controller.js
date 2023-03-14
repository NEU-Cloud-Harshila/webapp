const express = require('express');
const multer = require("multer");
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const basicAuth = require('_middleware/basic-auth');
const productService = require('./product.service');

router.post('/v1/product', basicAuth(), productSchema, product);
router.delete('/v1/product/:id', basicAuth(), _delete);
router.put('/v1/product/:id', basicAuth(), productUpdateSchema, update);
router.patch('/v1/product/:id', basicAuth(), productPatchSchema, update);
router.get('/v1/product/:id', getProductByID);

module.exports = router;

function productSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        sku: Joi.string().required(),
        manufacturer: Joi.string().required(),
        quantity: Joi.number().integer().min(0).max(100).required()
    });

    const allowedKeys = ['name', 'description', 'sku', 'manufacturer', 'quantity', 'date_added', 'date_last_updated', 'owner_user_id'];

    const bodyKeys = Object.keys(req.body);
    for (let key of bodyKeys) {
        if (!allowedKeys.includes(key)) {
            throw 'Bad Request. Unwanted key ' + key + ' found in the request';
        }
    }

    validateRequest(req, next, schema);
}

function product(req, res, next) {
    productService.product(req, req.body)
        .then(product => res.status(201).json(product))
        .catch(next);
}

function _delete(req, res, next) {
    productService._delete(req.user.dataValues.id, req.params.id, res)
        .then(() => res.status(204).json({ message: 'No Content' }))
        .catch(next);
}

function productUpdateSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        sku: Joi.string().required(),
        manufacturer: Joi.string().required(),
        quantity: Joi.number().integer().min(0).max(100).required()
    });


    const allowedKeys = ['name', 'description', 'sku', 'manufacturer', 'quantity', 'date_added', 'date_last_updated', 'owner_user_id'];

    const bodyKeys = Object.keys(req.body);
    for (let key of bodyKeys) {
        if (!allowedKeys.includes(key)) {
            throw 'Bad Request. Unwanted key ' + key + ' found in the request';
        }
    }

    validateRequest(req, next, schema);
}

function update(req, res, next) {
    productService.update(req, req.body, res)
        .then(product => res.status(204).json(product))
        .catch(next);
}

function productPatchSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        sku: Joi.string().required(),
        manufacturer: Joi.string(),
        quantity: Joi.number().integer().min(0).max(100)
    });

    const allowedKeys = ['name', 'description', 'sku', 'manufacturer', 'quantity', 'date_added', 'date_last_updated', 'owner_user_id'];

    const bodyKeys = Object.keys(req.body);
    for (let key of bodyKeys) {
        if (!allowedKeys.includes(key)) {
            throw 'Bad Request. Unwanted key ' + key + ' found in the request';
        }
    }

    validateRequest(req, next, schema);
}

function getProductByID(req, res, next) {
    productService.getProductByID(req.params.id)
        .then(product => res.json(product))
        .catch(next);
}