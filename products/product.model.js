const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        name: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: false },
        sku: { type: DataTypes.STRING, allowNull: false, unique: true },
        manufacturer: { type: DataTypes.STRING, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false }
    };

    const options = {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        updatedAt: 'date_last_updated',
        createdAt: 'date_added'
    };

    return sequelize.define('Product', attributes, options);
}