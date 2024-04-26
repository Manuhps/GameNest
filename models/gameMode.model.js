const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

const GameMode = sequelize.define("GameMode",
    {
        gameModeName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

module.exports = GameMode;