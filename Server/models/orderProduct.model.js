const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')

const OrderProduct = sequelize.define("OrderProduct",
{
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    salePrice: {
        type: DataTypes.DECIMAL(8,2),
        allowNull: false
    },
    orderID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Order', 
            key: 'orderID'
        }
    },
    productID: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Product', 
            key: 'productID'
        }
    }
})

module.exports = OrderProduct;