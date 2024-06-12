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
            allowNull: false,
            validate: {
                len: [2, 100]
            }
        },
        desc: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [10, 500]
            }
        },
        basePrice: {
            type: DataTypes.DECIMAL(8,2),
            allowNull: false,
            validate: {
                isNumeric: true,
                min: 0,
                max: 10000
            }
        },
        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                isInt: true
            }
        },
        rating: {
            type: DataTypes.DECIMAL(3, 1),
            allowNull: true,
            validate: {
                isNumeric: true,
                min: 1, 
                max: 5 
            }
        },
        img: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        platform: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [3, 40]
            }
        }
    }
);

module.exports = Product;