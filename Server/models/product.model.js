const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')

const Product = sequelize.define("Product",
    {
        productID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        basePrice: {
            type: DataTypes.DECIMAL(8,2),
            allowNull: false
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        rating: {
            type: DataTypes.DECIMAL(3, 1),
            allowNull: true,
            validate: {
                min: 1, 
                max: 5 
            }
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }
);

module.exports = Product;