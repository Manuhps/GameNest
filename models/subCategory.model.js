const sequelize = require('../connection')
const { DataTypes } = require('sequelize');

const SubCategory = sequelize.define("SubCategory",
    {
        subCategoryID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        subCategoryName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

//Synchronizes the Models With the DataBase
// SubCategory.sync({"logging":false})

module.exports = SubCategory;