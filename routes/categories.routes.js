const express = require('express');
const router = express.Router();

// import categories controller 
const categoriesController = require("../controllers/categories.controller");

router.route('/')
    .get(categoriesController.findAllCategory)
    .post(categoriesController.createCategory);

router.route('/:categoryID')
    .delete(categoriesController.deleteCategory);

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;