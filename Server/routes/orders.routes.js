const express = require('express');
const router = express.Router();

// import controller middleware
const { getAllOrders, getOrdersMe, createOrder, getCurrentOrder, updateOrder, updateProductQuantity, deleteOrderProduct, deleteOrder } = require("../controllers/orders.controller");
const { verifyAdmin, verifyUser } = require("../utilities/jwt");
const { checkToken } = require("../middlewares/checkToken");

router.route('/')
    .get(checkToken, verifyAdmin, getAllOrders)
    .post(checkToken, verifyUser, createOrder)

router.route('/me')
    .get(checkToken, verifyUser, getOrdersMe)

router.route('/current')
    .get(checkToken, verifyUser, getCurrentOrder)
    .patch(checkToken, verifyUser, updateOrder)

router.route('/current/products/:productID')
    .patch(checkToken, verifyUser, updateProductQuantity)
    .delete(checkToken, verifyUser, deleteOrderProduct)

router.route('/:orderID')
    .delete(checkToken, verifyAdmin, deleteOrder)

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not found' }); //send a predefined error message
});

//export this router
module.exports = router;
