const express = require('express');
const router = express.Router();

// import products controller
const { addProduct, getProducts, getProduct, deleteProduct, addReview } = require("../controllers/products.controller");

//import jwt middleware
const { verifyUser, verifyAdmin } = require("../middlewares/jwt")

//import checkToken middleware
const { checkToken } = require("../middlewares/checkToken")

//import checkProduct middleware
const { checkProduct } = require("../middlewares/checkProduct")

router.route('/')
    .post(checkToken, verifyAdmin, addProduct)
    .get(getProducts)

router.route('/:productID')
    .get(checkProduct, getProduct)
    .delete(checkToken, verifyAdmin, checkProduct, deleteProduct)

router.route('/:productID/reviews')
    // .post(checkToken, verifyUser, checkProduct, addReview)

router.route('/:productID/reviews/:reviewID/comments/:commentID')
    // .delete(deleteComment)

router.route('/:productID/discounts')
    // .post(addDiscount)

router.all('*', (req, res) => {
     res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;
