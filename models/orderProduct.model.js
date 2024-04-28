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
(async () => {
    await sequelize.sync();
    console.log('Tables Synchronized.');
})();

module.exports = {OrderProduct};