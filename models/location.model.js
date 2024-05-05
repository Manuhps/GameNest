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

module.exports = Location;