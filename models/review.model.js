const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('./index').sequelize;

const Review = sequelize.define("Review",
    {
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
        },
        userID: {
            type: DataTypes.integer,
            references: {
                model: User, 
                key: 'userID' 
            }
        },
        productID: {
            type: DataTypes.integer,
            references: {
                model: Product, 
                key: 'productID' 
            }
        }
    }
);

module.exports = Review;