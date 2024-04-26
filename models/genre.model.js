const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index');

const Genre = sequelize.define("Genre",
    {
        genreName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

module.exports = Genre;