const sequelize = require('../connection')
const { DataTypes } = require('sequelize');

const Location = sequelize.define("Location",
    {
        postalCode: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false   
        },
        location: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
    }
);

//Synchronizes the Models With the DataBase
(async () => {
    await sequelize.sync();
    console.log('Tables Synchronized.');
})();

module.exports = {Location};