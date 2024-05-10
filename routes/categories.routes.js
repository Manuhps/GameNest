const express = require('express');
const router = express.Router();

// import controller middleware
const categoriesController = require("../controllers/categories.controller");

router.route('/categories')
    .get(categoriesController.findAllCategory)
    .post(categoriesController.createCategory);

router.route('/categories/:categoryID')
    .delete(categoriesController.delete);

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;