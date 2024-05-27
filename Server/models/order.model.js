const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')

const Order = sequelize.define("Order",
    {
        orderID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        deliverDate: {
            type: DataTypes.DATE,
            allowNull: true,
            // validate: { notNull: { msg: "State can not be empty or null!" } }
        },
        cardName: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        cardNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cardExpiryDate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: { notNull: { msg: "State can not be empty or null!" } }
        }
    }
);

Order.associate = function(models) {
    Order.hasMany(models.OrderProduct, {
        foreignKey: 'orderID',
        as: 'orderProducts'
    });
};


module.exports = Order;