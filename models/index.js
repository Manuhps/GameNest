const { DataTypes } = require('sequelize');
const sequelize = require('../connection')
// const Category = require('./category.model')

const Product = sequelize.define("Product",
    {
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
        },
    }
    
);


const Category = sequelize.define("Category",
    {
        categoryName: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }
);






// const User = require('./user.model');
// const Order = require('./order.model');
// const Discount = require('./discount.model');
// const Review = require('./review.model');

// const Product = require('./product.model');
// const Category = require('./category.model');

// const OrderProduct = require('./orderProduct.model');
// const SubCategory = require('./subCategory.model');
// const Location = require('./location.model');
// const Genre = require('./genre.model');
// const GameMode = require('./gameMode.model');

// User.hasMany(Order)  //One user can have many orders.
// Order.belongsTo(User)  //One order can have only one user.

// User.hasOne(Location)  //One user can have one location.
// Location.hasMany(User) //One Location can have many Users

// User.hasMany(Review)  //One user can have many reviews.
// Review.belongsTo(User) //Each Review has only one user

// Order.belongsToMany(Product, { through: OrderProduct })  //Creates intermediary table between Order and Product.
// Product.belongsToMany(Order, { through: OrderProduct })  //Creates intermediary table between Order and Product.

// Product.hasMany(Review)  //One product can have many reviews.
// Review.belongsTo(Product) //Each Review has only one Product

Product.belongsTo(Category)  //One product can have one category
Category.hasMany(Product) //One Category has many Products

// Product.belongsToMany(Genre, { through: 'ProductGenre' })  //Creates intermediary table between Product and Genre
// Genre.belongsToMany(Product, { through: 'ProductGenre' })  //Creates intermediary table between Product and Genre

// Product.hasMany(Discount) //One Product can have many Discounts(but only one at a time)
// Discount.belongsTo(Product)  //One Discount can have only one product

// Product.belongsToMany(GameMode, { through: 'ProductGameMode' })  //Creates intermediary table between Product and GameMode
// GameMode.belongsToMany(Product, { through: 'ProductGameMode' })  //Creates intermediary table between Product and GameMode

// Category.hasOne(SubCategory)  //One Category can have one SubCategory
// SubCategory.belongsTo(Category)  //One SubCategory has one Category



//Synchronizes the Models With the DataBase
(async () => {
    await sequelize.sync();
    console.log('Tables Synchronized.');
})();