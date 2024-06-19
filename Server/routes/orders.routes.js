const express = require('express');
const router = express.Router();

// import controller middleware
const { getAllOrders, getOrdersMe, createOrder, getCurrentOrder, updateOrder, updateProductQuantity, deleteOrderProduct, deleteOrder} = require("../controllers/orders.controller");
const { verifyAdmin, verifyUser } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken");
const { checkIsBanned } = require('../middlewares/checkIsBanned');

router.route('/')
    .get(checkToken, verifyAdmin, checkIsBanned, getAllOrders)
    .post(checkToken, verifyUser, checkIsBanned, createOrder)

router.route('/me')
    .get(checkToken, verifyUser, checkIsBanned, getOrdersMe)

router.route('/current')
    .get(checkToken, verifyUser, checkIsBanned, getCurrentOrder)
    .patch(checkToken, verifyUser, checkIsBanned, updateOrder)

router.route('/current/products/:productID')
    .patch(checkToken, verifyUser, checkIsBanned, updateProductQuantity)
    .delete(checkToken, verifyUser, checkIsBanned, deleteOrderProduct)

router.route('/:orderID')
    .delete(checkToken, verifyAdmin, checkIsBanned, deleteOrder)

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not found' }); //send a predefined error message
});

//export this router
module.exports = router;