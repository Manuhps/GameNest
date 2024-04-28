const { DataTypes } = require('sequelize');
const sequelize = require('../connection')
const Location = require('./location.model');

const User = sequelize.define("User",
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        address: DataTypes.STRING,
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: DataTypes.STRING,
        isBanned: DataTypes.BOOLEAN,
        postalCode: {
            type: DataTypes.STRING,
            references: {
                model: Location, 
                key: 'postalCode' 
            }
        }
    }
);

//Synchronizes the Models With the DataBase
(async () => {
    await sequelize.sync();
    console.log('Tables Synchronized.');
})();

module.exports = {User};