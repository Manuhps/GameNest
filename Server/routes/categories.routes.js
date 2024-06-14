const express = require('express');
const router = express.Router();

// import categories controller 
const { findAllCategory, createCategory, deleteCategory, getSubCategories, addSubCategory, delSubCategory } = require("../controllers/categories.controller");
const { verifyAdmin } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken")
const { checkSubCategoryExists, checkSubCategory } = require("../middlewares/checkSubCategory")
const { checkCategory } = require("../middlewares/checkCategory")

router.route('/')
    .get(checkToken, findAllCategory)
    .post(checkToken, verifyAdmin, createCategory)

router.route('/:categoryID')
    .delete(checkToken, verifyAdmin, deleteCategory)

router.route('/:categoryID/subCategories')
    .post(checkToken, verifyAdmin, checkSubCategoryExists, addSubCategory)
    .get(checkToken, verifyAdmin, checkCategory,  getSubCategories)

router.route('/:categoryID/subCategories/:subCategoryID')
    .delete(checkToken, verifyAdmin, checkCategory, checkSubCategory, delSubCategory)

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;