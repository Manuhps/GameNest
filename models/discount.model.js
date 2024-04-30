const { DataTypes } = require('sequelize');
const sequelize = require('../connection')
const Product = require('./product.model')

const Discount = sequelize.define("Discount",
    {
        discountID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        percentage: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 100
            }
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }
);

//Synchronizes the Models With the DataBase
// Discount.sync({"logging":false})

module.exports = Discount;