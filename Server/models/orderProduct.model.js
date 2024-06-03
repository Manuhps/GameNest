const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')

const OrderProduct = sequelize.define("OrderProduct",
{
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orderID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Order',  // Nome do modelo como string
            key: 'orderID'
        }
    },
    productID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Product',  // Nome do modelo como string
            key: 'productID'
        }
    }
})

module.exports = OrderProduct;