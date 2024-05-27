const express = require('express');
const router = express.Router();

// import categories controller 
const { findAllCategory, createCategory, deleteCategory } = require("../controllers/categories.controller");
const { verifyAdmin } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken")

router.route('/')
    .get(checkToken, verifyAdmin, findAllCategory)
    .post(checkToken, verifyAdmin, createCategory);

router.route('/:categoryID')
    .delete(checkToken, verifyAdmin, deleteCategory);

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;