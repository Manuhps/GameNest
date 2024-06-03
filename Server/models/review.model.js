const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')
const updateProductRating = require('../hooks/updateProductRating')

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

Review.addHook('afterCreate', async (review, options) => {
    try {
        await updateProductRating(review.productID);
    } catch (error) {
        console.error('Error in afterCreate hook:', error);
        throw error;
    }
});

Review.addHook('afterUpdate', async (review, options) => {
    try {
        await updateProductRating(review.productID);
    } catch (error) {
        console.error('Error in afterUpdate hook:', error);
        throw error;
    }
});

Review.addHook('afterDestroy', async (review, options) => {
    try {
        await updateProductRating(review.productID);
    } catch (error) {
        console.error('Error in afterDestroy hook:', error);
        throw error;
    }
});

module.exports = Review;