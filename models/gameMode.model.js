const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');

const GameMode = sequelize.define("GameMode",
    {
        gameModeName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

module.exports = GameMode;