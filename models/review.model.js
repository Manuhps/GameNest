const { DataTypes } = require('sequelize');
const sequelize = require('../connection')
const User = require('./user.model')
const Product = require('./product.model')

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

//Synchronizes the Models With the DataBase
// Review.sync({"logging":false})

module.exports = Review;