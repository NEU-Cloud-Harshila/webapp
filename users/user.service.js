const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
var validator = require("email-validator");
const logger = require('_helpers/logger');
const StatsD = require('node-statsd');
const client = new StatsD();

module.exports = {
    getById,
    user,
    update
};

async function getById(id) {
    logger.info(`Getting user by ID ${id}`);

    client.increment('Get user');
    const user = await getUser(id);

    logger.info(`Got user by ID ${id}: ${JSON.stringify(user)}`);

    return user;
}

async function user(params) {
    logger.info(`Creating user: ${JSON.stringify(params)}`);

    client.increment('Create user');

    if (await db.User.findOne({ where: { username: params.username } })) {
        const errorMsg = `Bad Request. Username "${params.username}" already exists.`;
        logger.error(errorMsg);
        throw errorMsg;
    }

    if (params.password) {
        logger.info("Password validated");
        params.password = await bcrypt.hash(params.password, 10);
    }

    if (!validator.validate(params.username)) {
        const errorMsg = `Entered username "${params.username}" value is not in correct format.`;
        logger.error(errorMsg);
        throw errorMsg;
    }

    var userInfo;
    if (await db.User.create(params)) {
        userInfo = await db.User.findOne({
            where: {
                username: params.username
            },
        })
    }

    logger.info(`Created user: ${JSON.stringify(userInfo)}`);

    return omitPassword(userInfo.get());
}

async function update(id, params) {
    logger.info(`Updating user by ID ${id}: ${JSON.stringify(params)}`);

    client.increment('Update user');
    const user = await getUser(id);
    var key = "username";
    delete params[key];

    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    Object.assign(user, params);
    await user.save();
    logger.info(`Updated user by ID ${id}: ${JSON.stringify(user)}`);

    return omitPassword(user.get());
}

async function getUser(id) {
    logger.info(`Getting user by ID ${id}`);

    const user = await db.User.findByPk(id);

    if (!user) {
        const errorMsg = 'User not found with ID ${id}';
        logger.error(errorMsg);
        throw errorMsg;
    }

    logger.info(`Got user by ID ${id}: ${JSON.stringify(user)}`);

    return omitPassword(user.get());

}

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}