const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        first_name: { type: DataTypes.STRING, allowNull: false },
        last_name: { type: DataTypes.STRING, allowNull: false },
        username: { type: DataTypes.STRING, allowNull: false },
        password: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        updatedAt: 'account_updated',
        createdAt: 'account_created'
    };

    return sequelize.define('User', attributes, options);
}