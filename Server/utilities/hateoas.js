const secret = process.env.SECRET;
const jwt = require("jsonwebtoken");
const { User } = require('../models/index');
const { handleJsonWebTokenError } = require("./errors");

module.exports = {
    getProductLinks: async (req, request, res) => {
        let links = []
        let user = null;

        // Verify and decode token
        const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : null;
        if (token) {
            try {
                const decoded = jwt.verify(token, secret);
                user = await User.findByPk(decoded.id);
            } catch (error) {
                handleJsonWebTokenError(res)
            }
        }

        //Admin Routes for Products
        const addProduct = { rel: 'addProduct', href: `/products`, method: 'POST' }
        const delProduct = { rel: 'delProduct', href: `/products/productID`, method: 'DELETE' }
        const editProduct = { rel: 'editProduct', href: `/products/productID`, method: 'PATCH' }
        const delComment = { rel: 'delComment', href: `/products/productID/reviews/reviewID`, method: 'DELETE' }
        const addDiscount = { rel: 'addDiscount', href: `/products/productID/discounts`, method: 'POST' }
        const delDiscount = { rel: 'delDiscount', href: `/products/productID/discounts/discountID`, method: 'DELETE' }
        //User Routes for Products
        const addReview = { rel: 'addReview', href: `/products/productID/reviews`, method: 'POST' }
        //Non authenticated user routes for Products
        const getProducts = { rel: 'getProducts', href: `/products`, method: 'GET' }
        const getProduct = { rel: 'getProduct', href: `/products/productID`, method: 'GET' }

        //Creates hateoas links for the getProducts Request for Admins
        if (user && user.role == 'admin' && request == "getProducts") {
            links.push(addProduct, delProduct, editProduct, delComment, addDiscount, delDiscount, getProduct)
        }
        //Creates hateoas links for the getProduct Request for Admins
        if (user && user.role == 'admin' && request == "getProduct") {
            links.push(addProduct, delProduct, editProduct, delComment, addDiscount, delDiscount, getProducts)
        }
        //Creates hateoas links for the getProducts Request for Users
        if (user && user.role == 'user' && request == "getProducts") {
            links.push(getProduct, addReview)
        }
        //Creates hateoas links for the getProduct Request for Users
        if (user && user.role == 'user' && request == "getProducts") {
            links.push(getProducts, addReview)
        }
        //Creates hateoas links for the getProducts Request for Non Authenticated Users
        if (user == null && request == "getProducts") {
            links.push(getProduct)
        }
        //Creates hateoas links for the getProduct Request for Non Authenticated Users
        if (user == null && request == "getProduct") {
            links.push(getProducts)
        }
        return links
    }
}