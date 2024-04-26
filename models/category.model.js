const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');

const Category = sequelize.define("Category",
    {
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

module.exports = Category;