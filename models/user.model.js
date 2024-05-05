const { DataTypes } = require('sequelize');
const sequelize = require('../connection')

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
        isBanned: DataTypes.BOOLEAN,
        points: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                // custom validation function 
                isBoolean: function (val) {
                    if (typeof (val) != 'boolean')
                        throw new Error('Type must contain a boolean value!');
                }
            } 
        }
    }
);

module.exports = User;