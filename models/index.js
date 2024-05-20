// const sequelize = require('../connection');

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
const PointsTransaction = require('./pointsTransaction.model');

// Category.hasOne(SubCategory);  // One category can have one subcategory.  
// SubCategory.belongsTo(Category);  // One subcategory has one category.

// User.belongsTo(Location);  // Each user has only one location.
// Location.hasMany(User);  // One location can have many users.

// Product.belongsTo(Category);  // One product can have one category. 
// Category.hasMany(Product);  // One category can have many products.

// Product.hasMany(Review);  // One product can have many reviews.
// Review.belongsTo(Product);  // Each review has only one product.

// User.hasMany(Review);  // One user can have many reviews.
// Review.belongsTo(User);  // Each review has only one user.

// User.hasMany(Order);  // One user can have many orders.
// Order.belongsTo(User);  // One order can have only one user.

// Product.belongsToMany(Genre, { through: 'ProductGenre' });  // Creates intermediary table between Product and Genre.
// Genre.belongsToMany(Product, { through: 'ProductGenre' });  // Creates intermediary table between Product and Genre.

// Product.belongsToMany(GameMode, { through: 'ProductGameMode' });  // Creates intermediary table between Product and GameMode.
// GameMode.belongsToMany(Product, { through: 'ProductGameMode' });  // Creates intermediary table between Product and GameMode.

// Product.hasMany(Discount);  // One product can have many discounts (but only one at a time).
// Discount.belongsTo(Product);  // Each discount has only one product.

// Order.belongsToMany(Product, { through: OrderProduct });  // Creates intermediary table between Order and Product.
// Product.belongsToMany(Order, { through: OrderProduct });  // Creates intermediary table between Order and Product.

// PointsTransaction.belongsTo(User) // Each points transaction is associated to one User
// User.hasMany(PointsTransaction) // Each User can have many Points Transactions

// PointsTransaction.belongsTo(Order) // Each points transaction is associated to one Order
// Order.hasMany(PointsTransaction) // Each Order can have many Points Transactions (receiving or paying points)

// sequelize.sync({'logging': false, 'force': true});

module.exports = { User, Product, Order, Category, SubCategory, Discount, OrderProduct, Location, Review, Genre, GameMode, PointsTransaction};