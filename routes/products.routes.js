const express = require('express');
const router = express.Router();

// import products controller
const productsController = require("../controllers/products.controller");

router.route('/')
    .post(productsController.addProduct)
    .get(productsController.getProducts)

router.route('/:productID')
    .get(productsController.getProduct)
    // .delete(productsController.deleteProduct)

router.route('/:productID/reviews')
    // .post(productsController.addReview)

router.route('/:productID/reviews/:reviewID/comments/:commentID')
    // .delete(productsController.deleteComment)

router.route('/:productID/discounts')
    // .post(productsController.addDiscount)

router.all('*', (req, res) => {
     res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;