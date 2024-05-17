const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Category = sequelize.define("Category",
    {
        categoryID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false,
            //validate: { notNull: { msg: "Category Name can not be empty or null!" } }
        }
    }
);

module.exports = Category;