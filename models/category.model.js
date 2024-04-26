const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

const Category = sequelize.define("Category",
    {
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

module.exports = Category;