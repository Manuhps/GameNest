const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')

const GameMode = sequelize.define("GameMode",
    {
        gameModeID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        gameModeName: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }
);

module.exports = GameMode;