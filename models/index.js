const config = require('../config/db.config');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD,
    {
        host: config.HOST,
        dialect: config.dialect
    }
);

const User = require('./user.model');
const Product = require('./product.model');
const Order = require('./order.model');
const Location = require('./location.model');
const Review = require('./review.model');
const Discount = require('./discount.model');
const Category = require('./category.model');
const SubCategory = require('./subCategory.model');
const OrderProduct = require('./orderProduct.model');
const Genre = require('./genre.model');
const GameMode = require('./gameMode.model');

User.hasMany(Order)  //One user can have many orders.
Order.belongsTo(User)  //One order can have only one user.

User.hasOne(Location)  //One user can have one location.
Location.hasMany(User) //One Location can have many Users

User.hasMany(Review)  //One user can have many reviews.
Review.belongsTo(User) //Each Review has only one user

Order.belongsToMany(Product, { through: OrderProduct })  //Creates intermediary table between Order and Product.
Product.belongsToMany(Order, { through: OrderProduct })  //Creates intermediary table between Order and Product.

Product.hasMany(Review)  //One product can have many reviews.
Review.belongsTo(Product) //Each Review has only one Product

Product.belongsTo(Category)  //One product can have one category
Category.hasMany(Product) //One Category has many Products

Product.belongsToMany(Genre, { through: 'ProductGenre' })  //Creates intermediary table between Product and Genre
Genre.belongsToMany(Product, { through: 'ProductGenre' })  //Creates intermediary table between Product and Genre

Product.hasMany(Discount) //One Product can have many Discounts(but only one at a time)
Discount.belongsTo(Product)  //One Discount can have only one product

Product.belongsToMany(GameMode, { through: 'ProductGameMode' })  //Creates intermediary table between Product and GameMode
GameMode.belongsToMany(Product, { through: 'ProductGameMode' })  //Creates intermediary table between Product and GameMode

Category.hasOne(SubCategory)  //One Category can have one SubCategory
SubCategory.belongsTo(Category)  //One SubCategory has one Category

//Synchronizes the Models With the DataBase

(async () => {
    await sequelize.sync();
    console.log('Tables Synchronized.');
})();