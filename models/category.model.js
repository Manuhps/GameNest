const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Category = sequelize.define("Category",
    {
        categoryID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

// Category.sync({"logging":false})

module.exports = Category;