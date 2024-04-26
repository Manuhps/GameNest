const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

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

module.exports = Location;