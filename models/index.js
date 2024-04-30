// const sequelize = require('../connection');

const Category = require('./category.model');
const SubCategory = require('./subCategory.model');
const Product = require('./product.model');
const Genre = require('./genre.model');
const GameMode = require('./gameMode.model');
const Discount = require('./discount.model');
const User = require('./user.model');
const Location = require('./location.model');
const Order = require('./order.model');
const Review = require('./review.model');
const OrderProduct = require('./orderProduct.model');

// Category.hasOne(SubCategory);  // One category can have one subcategory.  
// SubCategory.belongsTo(Category);  // One subcategory has one category.

// User.hasMany(Order);  // One user can have many orders.
// Order.belongsTo(User);  // One order can have only one user.

// User.belongsTo(Location);  // Each user has only one location.
// Location.hasMany(User);  // One location can have many users.

// User.hasMany(Review);  // One user can have many reviews.
// Review.belongsTo(User);  // Each review has only one user.

// Product.belongsToMany(Genre, { through: 'ProductGenre', as: 'ProductGenres' });  // Creates intermediary table between Product and Genre.
// Genre.belongsToMany(Product, { through: 'ProductGenre', as: 'GenreProducts' });  // Creates intermediary table between Product and Genre.

// Product.belongsToMany(GameMode, { through: 'ProductGameMode', as: 'ProductGameModes' });  // Creates intermediary table between Product and GameMode.
// GameMode.belongsToMany(Product, { through: 'ProductGameMode', as: 'gameModeProducts' });  // Creates intermediary table between Product and GameMode.

// Product.hasMany(Review);  // One product can have many reviews.
// Review.belongsTo(Product);  // Each review has only one product.

// Product.belongsTo(Category);  // One product can have one category. 
// Category.hasMany(Product);  // One category can have many products.

// Product.hasMany(Discount);  // One product can have many discounts (but only one at a time).
// Discount.belongsTo(Product);  // Each discount has only one product.

// Order.belongsToMany(Product, { through: OrderProduct, as: 'OrderProducts' });  // Creates intermediary table between Order and Product.
// Product.belongsToMany(Order, { through: OrderProduct, as: 'ProductOrders' });  // Creates intermediary table between Order and Product.
    
// sequelize.sync({'logging': false});

module.exports = { User, Product, Order, Category, SubCategory, Discount, OrderProduct, Location, Review, Genre, GameMode };