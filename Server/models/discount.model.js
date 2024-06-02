const { DataTypes } = require('sequelize');
const sequelize = require('../../connection')


const Discount = sequelize.define("Discount",
    {
        discountID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        percentage: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0,
                max: 100
            }
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: { notNull: { msg: "Start date can not be empty or null!" } }
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: { notNull: { msg: "End date can not be empty or null!" } }
        }
    }
);

module.exports = Discount;