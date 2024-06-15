const { DataTypes } = require('sequelize');
const sequelize = require('../../connection');

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
            validate: { is: /^[A-Za-z]+$/}
        }
    }
);

module.exports = Category;