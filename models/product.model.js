// const { DataTypes } = require('sequelize');
// const sequelize = require('../connection')
// // const Category = require('./category.model')

// const Product = sequelize.define("Product",
//     {
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         desc: {
//             type: DataTypes.STRING,
//             allowNull: false,
//         },
//         basePrice: {
//             type: DataTypes.DECIMAL(8,2),
//             allowNull: false
//         },
//         stock: {
//             type: DataTypes.INTEGER,
//             allowNull: false
//         },
//         rating: {
//             type: DataTypes.DECIMAL(3, 1),
//             allowNull: true,
//             validate: {
//                 min: 1, 
//                 max: 5 
//             }
//         },
//         img: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },
//         platform: {
//             type: DataTypes.STRING,
//             allowNull: true
//         },
//     }
    
// );

// //Synchronizes the Models With the DataBase
// (async () => {
//     await sequelize.sync();
//     console.log('Tables Synchronized.');
// })();

// module.exports = {Product};