const express = require('express');
const router = express.Router();

// import controller middleware
const { getOrders, createOrder, getCurrentOrder, updateOrder, deleteOrder } = require("../controllers/orders.controller");
const { verifyAdmin, verifyUser } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken");

router.route('/')
    .get(checkToken, verifyAdmin, getOrders)
    .post(checkToken, verifyUser, createOrder)

router.route('/current')
    .get(checkToken, verifyUser, getCurrentOrder)
    .patch(checkToken, verifyUser, updateOrder)

router.route('/:orderID')
    .delete(checkToken, verifyAdmin, deleteOrder)

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not found' }); //send a predefined error message
});

//export this router
module.exports = router;

