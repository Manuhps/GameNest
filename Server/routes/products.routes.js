const express = require('express');
const router = express.Router();

// import products controller
const { addProduct, getProducts, getProduct, deleteProduct, addReview, addDiscount, deleteDiscount, deleteComment } = require("../controllers/products.controller");

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


router.route('/')
    .post(checkToken, verifyAdmin, addProduct)
    .get(getProducts)

router.route('/:productID')
    .get(checkProduct, getProduct)
    .delete(checkToken, verifyAdmin, checkProduct, deleteProduct)

router.route('/:productID/reviews')
    .post(checkToken, verifyUser, checkProduct, addReview)

router.route('/:productID/reviews/:reviewID/comment')
    .delete(checkToken, verifyAdmin, checkProduct, checkReview, checkComment, deleteComment)

router.route('/:productID/discounts')
    .post(checkToken, verifyAdmin, checkProduct, checkDiscount, addDiscount)

router.route('/:productID/discounts/:discountID')
    .delete(checkToken, verifyAdmin, checkProduct, checkDiscountExists, deleteDiscount) 

router.all('*', (req, res) => {
     res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;
