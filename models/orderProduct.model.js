const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');

const OrderProduct = sequelize.define("OrderProduct",
    {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
);

module.exports = OrderProduct;