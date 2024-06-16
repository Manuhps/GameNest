const express = require('express');
const router = express.Router();

// import products controller
const { addProduct, getProducts, getProduct, deleteProduct, addReview, getReviews, addDiscount, deleteDiscount, deleteComment, editProduct } = require("../controllers/products.controller");

//import jwt middleware
const { verifyUser, verifyAdmin } = require("../middlewares/jwt")
//import checkToken middleware
const { checkToken } = require("../middlewares/checkToken")
//import checkProduct middleware
const { checkProduct } = require("../middlewares/checkProduct")
//import checkDiscount middleware
const { checkDiscount } = require("../middlewares/checkDiscount")
//import checkDiscountExists middleware
const { checkDiscountExists } = require("../middlewares/checkDiscountExists")
//import checkReview middleware
const { checkReview } = require("../middlewares/checkReview")
//import checkComment middleware
const { checkComment } = require("../middlewares/checkComment")
const { checkIsBanned } = require('../middlewares/checkIsBanned')

router.route('/')
    .post(checkToken, verifyAdmin, checkIsBanned, addProduct)
    .get(getProducts)

router.route('/:productID')
    .get(checkProduct, getProduct)
    .delete(checkToken, verifyAdmin, checkIsBanned, checkProduct, deleteProduct)
    .patch(checkToken, verifyAdmin, checkIsBanned, checkProduct, editProduct)

router.route('/:productID/reviews')
    .post(checkToken, verifyUser, checkIsBanned, checkProduct, addReview)
    .get(checkToken, verifyUser, checkIsBanned, checkProduct, getReviews)

router.route('/:productID/reviews/:reviewID/comment')
    .delete(checkToken, verifyAdmin, checkIsBanned, checkProduct, checkReview, checkComment, deleteComment)

router.route('/:productID/discounts')
    .post(checkToken, verifyAdmin, checkIsBanned, checkProduct, checkDiscount, addDiscount)

router.route('/:productID/discounts/:discountID')
    .delete(checkToken, verifyAdmin, checkIsBanned, checkProduct, checkDiscountExists, deleteDiscount)

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;
