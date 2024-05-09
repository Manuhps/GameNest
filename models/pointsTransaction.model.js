const { DataTypes } = require('sequelize');
const sequelize = require('../connection')

const PointsTransaction = sequelize.define("PointsTransaction",
    {
        transactionID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        transactionType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        transactionPoints: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }
);

module.exports = PointsTransaction;