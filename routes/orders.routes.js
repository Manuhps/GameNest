const express = require('express');
const router = express.Router();

// import controller middleware
const { createOrder } = require("../controllers/orders.controller");
const { verifyAdmin } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken")

router.route('/')
    .post(checkToken, verifyAdmin, createOrder);


router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not found' }); //send a predefined error message
})

//export this router
module.exports = router;