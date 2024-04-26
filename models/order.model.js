const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

const Order = sequelize.define("Order",
    {
        deliverDate: {
            type: DataTypes.DATE,
            allowNull: true
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
            allowNull: false
        },
        userID: {
            type: DataTypes.INTEGER,
            references: {
                model: User, 
                key: 'userID' 
            }
        }
    }
);

module.exports = Order;