const sequelize = require('../../connection');

const Location = require('./location.model');
const User = require('./user.model');
const Category = require('./category.model');
const SubCategory = require('./subCategory.model');
const Product = require('./product.model');
const Discount = require('./discount.model');
const Genre = require('./genre.model');
const GameMode = require('./gameMode.model');
const Order = require('./order.model'); 
const Review = require('./review.model');
const OrderProduct = require('./orderProduct.model');

Category.hasOne(SubCategory, {foreignKey: 'categoryID'});  // One category can have one subcategory.  
SubCategory.belongsTo(Category, {foreignKey: 'categoryID'});  // One subcategory has one category.

User.belongsTo(Location, {foreignKey: 'postalCode'});  // Each user has only one location.
Location.hasMany(User, {foreignKey: 'postalCode'});  // One location can have many users.

Product.belongsTo(Category, {foreignKey: 'categoryID'});  // One product can have one category. 
Category.hasMany(Product, {foreignKey: 'categoryID'});  // One category can have many products.

Product.hasMany(Review, {foreignKey: 'productID'});  // One product can have many reviews.
Review.belongsTo(Product, {foreignKey: 'productID'});  // Each review has only one product.

User.hasMany(Review, {foreignKey: 'userID'});  // One user can have many reviews.
Review.belongsTo(User, {foreignKey: 'userID'});  // Each review has only one user.

User.hasMany(Order, {foreignKey: 'userID'});  // One user can have many orders.
Order.belongsTo(User, {foreignKey: 'userID'});  // One order can have only one user.

Product.belongsToMany(Genre, { through: 'ProductGenre', foreignKey: 'productID' });  // Creates intermediary table between Product and Genre.
Genre.belongsToMany(Product, { through: 'ProductGenre', foreignKey: 'genreID' });  // Creates intermediary table between Product and Genre.

Product.belongsToMany(GameMode, { through: 'ProductGameMode', foreignKey: 'productID' });  // Creates intermediary table between Product and GameMode.
GameMode.belongsToMany(Product, { through: 'ProductGameMode', foreignKey: 'gameModeID' });  // Creates intermediary table between Product and GameMode.

Product.hasMany(Discount, {foreignKey: 'productID'});  // One product can have many discounts (but only one at a time).
Discount.belongsTo(Product, {foreignKey: 'productID'});  // Each discount has only one product.

Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'productID'});  // Creates intermediary table between Order and Product.
Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'orderID' });  // Creates intermediary table between Order and Product.

sequelize.sync({'logging': false, 'force': false});

module.exports = { User, Product, Order, Category, SubCategory, Discount, OrderProduct, Location, Review, Genre, GameMode };