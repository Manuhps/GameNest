const sequelize = require('../connection')
const { DataTypes } = require('sequelize');

const SubCategory = sequelize.define("SubCategory",
    {
        subCategoryName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);

//Synchronizes the Models With the DataBase
(async () => {
    await sequelize.sync();
    console.log('Tables Synchronized.');
})();

module.exports = {SubCategory};