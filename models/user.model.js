const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');
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
        isBanned: DataTypes.Boolean,
        postalCode: {
            type: DataTypes.STRING,
            references: {
                model: Location, 
                key: 'postalCode' 
            }
        }
    }
);

module.exports = User;