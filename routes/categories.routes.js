const express = require('express');
const router = express.Router();

// import controller middleware
const categoriesController = require("../controllers/categories.controller");

router.route('/')
    .get(categoriesController.findAll)
    .post(categoriesController.bodyValidator, categoriesController.create);

router.route('/:id')
    .get(categoriesController.findOne)
    .put(categoriesController.bodyValidator, categoriesController.update)
    .delete(categoriesController.delete);

router.all('*', (req, res) => {
    res.status(404).json({ message: 'categories: what???' }); //send a predefined error message
})

//export this router
module.exports = router;