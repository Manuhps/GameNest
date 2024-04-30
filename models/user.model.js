const { DataTypes } = require('sequelize');
const sequelize = require('../connection')
const Location = require('./location.model');

const User = sequelize.define("User",
    {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
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
        isBanned: DataTypes.BOOLEAN
    }
);

//Synchronizes the Models With the DataBase
// User.sync({"logging":false})

module.exports = User;