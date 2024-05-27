const sequelize = require('../../connection')
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
            allowNull: false,
            validate: { notNull: { msg: "Location can not be empty or null!" } }
        }, 
    }
);

module.exports = Location;