const db = require('_helpers/db');
const bcrypt = require('bcryptjs');

module.exports = basicAuth;

function basicAuth() {
    return [
        async (req, res, next) => {

            var isProductAPI = false;

            var str = req._parsedUrl.pathname;
            if (str.includes('Product')) {
                isProductAPI = true;
            }

            var n = str.lastIndexOf('/');
            var userIDFromRequest = str.substring(n + 1);

            if (!req.headers.authorization || req.headers.authorization.indexOf('Basic ') === -1) {

                return res.status(401).json({ message: 'Missing Authorization Header' });
            }

            const base64Credentials = req.headers.authorization.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
            const [username, password] = credentials.split(':');

            const user = await db.User.findOne({
                where: {
                    username: username
                },
            })

            if (!user) {
                return res.status(401).json({ httpResponseCode: 401, message: 'Unauthorized. Invalid Authentication Credentials' });
            }

            const isPasswordMatch = bcrypt.compareSync(password, user.password)
            if (!isPasswordMatch) {
                return res.status(401).json({
                    message: 'Unauthorized access - Invalid username or password'
                })
            }

            if (userIDFromRequest && !isProductAPI) {
                if (user.dataValues.id != userIDFromRequest) {
                    return res.status(403).json({ httpResponseCode: 403, message: 'Forbidden. Invalid Authentication Credentials for the requested user' });
                }
            }

            req.user = user

            next();
        }
    ];
}