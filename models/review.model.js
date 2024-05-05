const { DataTypes } = require('sequelize');
const sequelize = require('../connection')

const Review = sequelize.define("Review",
    {
        reviewID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        rating: {
            type: DataTypes.DECIMAL(3,1),
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    }
);

module.exports = Review;