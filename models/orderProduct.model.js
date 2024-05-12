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

module.exports = OrderProduct;