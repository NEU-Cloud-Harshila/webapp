const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const basicAuth = require('_middleware/basic-auth')
const userService = require('./user.service');
const logger = require('_helpers/logger');

router.post('/v1/user', userSchema, user);
router.get('/v1/user/:id', basicAuth(), getById);
router.put('/v1/user/:id', basicAuth(), updateSchema, update);

module.exports = router;

function userSchema(req, res, next) {
    const schema = Joi.object({
        first_name: Joi.string().required(),
        last_name: Joi.string().required(),
        username: Joi.string().required(),
        password: Joi.string().min(6).required()
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    const userId = req.params.id;
    logger.info(`Updating user with ID ${userId}`);

    userService.update(req.params.id, req.body)
        .then(user => res.json(user))
        .catch(next);
}

function user(req, res, next) {
    logger.info(`Creating user with username ${req.body.username}`);

    userService.user(req.body)
        .then(user => res.json(user))
        .catch(next);
}

function getById(req, res, next) {
    const userId = req.params.id;
    logger.info(`Getting user with ID ${userId}`);

    userService.getById(req.params.id)
        .then(user => res.json(user))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        first_name: Joi.string().empty(''),
        last_name: Joi.string().empty(''),
        username: Joi.string().empty(''),
        password: Joi.string().min(6).empty('')
    });
    validateRequest(req, next, schema);
}