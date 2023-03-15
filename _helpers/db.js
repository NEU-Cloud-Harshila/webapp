const configDB = require('./configDB.js');
//const configTest = require('config.json');
//const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');
const { DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

module.exports = db = {};

initialize();

async function initialize() {
    //const { host, port, user, password, database } = configDB.db;
    //const connection = await mysql.createConnection({ host, port, user, password });
    //await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql'
        }
    );

    //const sequelize = new Sequelize(database, user, password, { dialect: 'mysql' });

    db.User = require('../users/user.model')(sequelize);
    db.Product = require('../products/product.model')(sequelize);
    db.Image = require('../images/image.model')(sequelize);

    db.User.hasOne(db.Product, {
        foreignKey: {
            name: 'owner_user_id',
            type: DataTypes.INTEGER
        }
    });

    db.Product.hasOne(db.Image, {
        foreignKey: {
            name: 'product_id',
            type: DataTypes.INTEGER
        }
    });

    await sequelize.sync();
}
