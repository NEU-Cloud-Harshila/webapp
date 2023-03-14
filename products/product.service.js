const db = require('_helpers/db');

module.exports = {
    product,
    _delete,
    update,
    getProductByID
};

async function product(request, params) {
    var productInfo;

    if (await db.Product.findOne({ where: { sku: params.sku } })) {
        throw 'Bad Request. SKU "' + params.sku + '" already exists.';
    }

    params.owner_user_id = request.user.dataValues.id;

    if (await db.Product.create(params)) {
        productInfo = await db.Product.findOne({
            where: {
                sku: params.sku
            },
        })
    }

    return productInfo.get();
};

async function _delete(authUserID, id, res) {
    let value = id;
    let isInt = value % 1;

    if (isInt !== 0) {
        throw 'Bad Request. Product ID should be an integer value.';
    }

    const product = await getProduct(id);

    if (authUserID && authUserID !== product.dataValues.owner_user_id) {
        return res.status(403).json({ httpResponseCode: 403, message: 'Forbidden. Unauthorized action for the user' });
    }

    await product.destroy();
};

async function getProduct(id) {
    const product = await db.Product.findByPk(id);
    if (!product) throw 'Product not found';
    return product;
};

async function update(request, params, res) {
    var productInfo;

    let value = request.params.id;
    let isInt = value % 1;

    if (isInt !== 0) {
        throw 'Bad Request. Product ID should be an integer value.';
    }

    if (await db.Product.findOne({ where: { sku: params.sku } })) {
        throw 'Bad Request. SKU "' + params.sku + '" already exists.';
    }

    params.owner_user_id = request.user.dataValues.id;

    const product = await getProduct(request.params.id);

    authUserID = request.user.dataValues.id;

    if (authUserID && authUserID !== product.dataValues.owner_user_id) {
        return res.status(403).json({ httpResponseCode: 403, message: 'Forbidden. Unauthorized action for the user' });
    }

    Object.assign(product, params);

    if (await product.save(params)) {
        productInfo = await db.Product.findOne({
            where: {
                sku: params.sku
            },
        })
    }

    return productInfo.get();
};

async function getProductByID(id) {
    return await getProduct(id);
}