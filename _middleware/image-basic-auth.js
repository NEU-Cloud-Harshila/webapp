const db = require('_helpers/db');
const bcrypt = require('bcryptjs');

module.exports = imagebasicAuth;

function imagebasicAuth() {
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

            const productList = await db.Product.findOne({
                where: {
                    owner_user_id: user.id,
                    id: productID
                  }
                
            });

            if (!productList) {
                return res.status(400).json({ httpResponseCode: 400, message: 'No products found for the user in order to upload the image.' });
            }

            next();
        }
    ];
}