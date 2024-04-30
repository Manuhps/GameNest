const { DataTypes } = require('sequelize');
const sequelize = require('../connection')

const OrderProduct = sequelize.define("OrderProduct",
    {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
);

//Synchronizes the Models With the DataBase
// OrderProduct.sync({"logging":false})

module.exports = OrderProduct;