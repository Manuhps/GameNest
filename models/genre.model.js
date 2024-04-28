const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Genre = sequelize.define("Genre",
    {
        genreName: {
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

module.exports = {Genre};