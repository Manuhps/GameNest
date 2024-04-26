const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

const SubCategory = sequelize.define("SubCategory",
    {
        subCategoryName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

module.exports = SubCategory;