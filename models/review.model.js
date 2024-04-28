const { DataTypes } = require('sequelize');
const sequelize = require('../connection')
const User = require('./user.model')
const Product = require('./product.model')

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
            type: DataTypes.INTEGER,
            references: {
                model: User, 
                key: 'userID' 
            }
        },
        productID: {
            type: DataTypes.INTEGER,
            references: {
                model: Product, 
                key: 'productID' 
            }
        }
    }
);

//Synchronizes the Models With the DataBase
(async () => {
    await sequelize.sync();
    console.log('Tables Synchronized.');
})();

module.exports = {Review};