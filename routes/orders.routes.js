const express = require('express');
const router = express.Router();

// import controller middleware
const ordersController = require("../controllers/orders.controller");

router.route('/')
    .get(ordersController.findAll)
    .post(ordersController.bodyValidator, ordersController.create);

router.route('/:id')
    .get(ordersController.findOne)
    .put(ordersController.bodyValidator, ordersController.update)
    .delete(ordersController.delete);

router.all('*', (req, res) => {
    res.status(404).json({ message: 'orders: what???' }); //send a predefined error message
})

//export this router
module.exports = router;