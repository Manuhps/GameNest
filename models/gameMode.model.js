const { DataTypes } = require('sequelize');
const sequelize = require('../connection')

const GameMode = sequelize.define("GameMode",
    {
        gameModeName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

//Synchronizes the Models With the DataBase
(async () => {
    await sequelize.sync();
    console.log('Tables Synchronized.');
})();

module.exports = {GameMode};