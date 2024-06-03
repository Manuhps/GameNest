const updateProductRating = async (productID) => {
    try {
        const Review = require('../models/review.model');
        const Product = require('../models/product.model');
        const reviews = await Review.findAll({ where: {productID: productID} });
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((sum, review) => sum + parseFloat(review.rating), 0);
            const averageRating = totalRating / reviews.length;
            await Product.update({ rating: averageRating.toFixed(1) }, { where: { productID: productID } });
        } else {
            await Product.update({ rating: null }, { where: { productID: productID } });
        }
    } catch (error) {
        throw new Error('Error updating product rating: ' + error.message);
    }
};

module.exports = updateProductRating
