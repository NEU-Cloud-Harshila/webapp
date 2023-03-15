const bcrypt = require('bcryptjs');
const db = require('_helpers/db');
var validator = require("email-validator");

module.exports = {
    getById,
    user,
    update
};

async function getById(id) {
    return await getUser(id);
}

async function user(params) {
    if (await db.User.findOne({ where: { username: params.username } })) {
        throw 'Bad Request. Username "' + params.username + '" already exists.';
    }

    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    if (!validator.validate(params.username))
        throw 'Entered Username "' + params.username + '" value is not in correct format. ';

    var userInfo;
    if (await db.User.create(params)) {
        userInfo = await db.User.findOne({
            where: {
                username: params.username
            },
        })
    }

    return omitPassword(userInfo.get());
}

async function update(id, params) {
    const user = await getUser(id);
    var key = "username";
    delete params[key];
    console.log(params);

    if (params.password) {
        params.password = await bcrypt.hash(params.password, 10);
    }

    Object.assign(user, params);
    await user.save();

    return omitPassword(user.get());
}

async function getUser(id) {
    const user = await db.User.findByPk(id);
    if (!user) throw 'User not found';
    return omitPassword(user.get());
}

function omitPassword(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}