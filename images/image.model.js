const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        image_id: {  type: DataTypes.INTEGER, primaryKey: true, autoIncrement:true, allowNull: false  },
        product_id: { type: DataTypes.INTEGER, allowNull: false },
        file_name: { type: DataTypes.STRING, allowNull: false },
        s3_bucket_path: { type: DataTypes.STRING, allowNull: false }
    };

    const options = {
        timestamps: true,
        underscored: true,
        freezeTableName: true,
        createdAt: 'date_created',
        updatedAt: false
    };

    return sequelize.define('Image', attributes, options);
}