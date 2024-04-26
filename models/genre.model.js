const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

const Genre = sequelize.define("Genre",
    {
        genreName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

module.exports = Genre;