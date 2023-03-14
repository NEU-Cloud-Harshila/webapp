const db = require('_helpers/db');
const bcrypt = require('bcryptjs');

module.exports = userBasicAuth;

function userBasicAuth() {
    return [
        async (req, res, next) => {

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

            const productList = await db.Product.findAll({
                where: {
                    owner_user_id: user.id
                },
            });

            const productID = req?.params?.product_id;

            const productExists = await db.Product.findOne({
                where: {
                    id: productID
                },
            });

            if (!productExists) {
                return res.status(404).json({ httpResponseCode: 404, message: 'Not Found. Product does not exist.' });
            }

            var result = [];

            productList.forEach(res => {
                if (res.dataValues.id == productID)
                result.push(productID);
            });  

            if (result.length === 0) {
                return res.status(403).json({
                    message: 'Forbidden. Cannot access other user data'
                })
              }

            next();
        }
    ];
}