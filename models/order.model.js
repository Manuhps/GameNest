const { DataTypes } = require('sequelize');
const sequelize = require('../connection')
const User = require('./user.model')

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

//Synchronizes the Models With the DataBase
(async () => {
    await sequelize.sync();
    console.log('Tables Synchronized.');
})();

module.exports = {Order};