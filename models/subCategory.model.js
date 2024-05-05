const sequelize = require('../connection')
const { DataTypes } = require('sequelize');

const SubCategory = sequelize.define("SubCategory",
    {
        subCategoryID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        subCategoryName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

module.exports = SubCategory;