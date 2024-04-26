const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

const Discount = sequelize.define("Discount",
    {
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
        },
        productID: {
            type: DataTypes.integer,
            references: {
                model: Product, 
                key: 'productID' 
            }
        }
    }
);

module.exports = Discount;