const { DataTypes } = require('sequelize');
const sequelize = require('../connection');

const Genre = sequelize.define("Genre",
    {
        genreID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        genreName: {
            type: DataTypes.STRING,
            allowNull: false,
            //validate: { notNull: { msg: "Genre Name can not be empty or null!" } }
        }
    }
);

module.exports = Genre;