const db = require('_helpers/db');
const bcrypt = require('bcryptjs');

module.exports = delUserAuth;

function delUserAuth() {
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

            const productID = req?.params?.product_id;

            const productData = await db.Product.findOne({
                where: {
                    owner_user_id: user.id,
                    id: productID
                  }
                
            });

            if (!productData) {
                return res.status(403).json({ httpResponseCode: 403, message: 'Forbidden. No products found for the user.' });
            }

            next();
        }
    ];
}