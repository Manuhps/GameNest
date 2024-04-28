const { DataTypes } = require('sequelize');
const sequelize = require('../connection')
const Product = require('./product.model')

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
            type: DataTypes.INTEGER,
            references: {
                model: Product, 
                key: 'productID' 
            }
        }
    }
);

//Synchronizes the Models With the DataBase
(async () => {
    await sequelize.sync();
    console.log('Tables Synchronized.');
})();

module.exports = {Discount};