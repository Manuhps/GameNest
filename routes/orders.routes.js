const express = require('express');
const router = express.Router();

// import controller middleware
const { createOrder } = require("../controllers/orders.controller");
const { verifyAdmin } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken")

router.route('/')
    .post(checkToken, verifyAdmin, createOrder);


router.all('*', (req, res) => {
    res.status(404).json({ message: 'orders: what???' }); //send a predefined error message
})

//export this router
module.exports = router;