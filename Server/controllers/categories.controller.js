const express = require('express');
const router = express.Router();
const { Category, SubCategory } = require('../models/index');
const { generatePaginationPath, paginate } = require("../utilities/pagination");
const { handleBadRequest } = require('../utilities/errors');

module.exports = {
    findAllCategory: async (req, res) => {
        try {
            const categories = await paginate(Category)
            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage
            const links = [
                { rel: "createCategories", href: "/categories", method: "POST" },
                { rel: "deleteCategories", href: "/categories/:categoryID", method: "DELETE" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];
            res.status(200).send(
                {
                    pagination: categories.pagination,
                    data: categories.data,
                    links: links
                });
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        }
    },
    createCategory: async (req, res) => {
        try {
            // Verify if the category is empty
            if (!req.body.categoryName) {
                return res.status(400).send({
                    message: "Category content cannot be empty"
                });
            }
            if (req.body.categoryName) {
                const existingCategory = await Category.findOne({ where: { categoryName: req.body.categoryName } });
                if (existingCategory) {
                    return res.status(409).send({ message: "Category already exists" });
                }
            }

            const regex = /^[A-Za-z\s]+$/;
            if (!regex.test(req.body.categoryName)) {
                return res.status(400).send({
                    message: "Category name must be a string"
                });
            }

            //Create and Save in the database
            await Category.create({
                categoryName: req.body.categoryName,
            });
            res.status(201).send({
                message: "New Category created with success."
            });
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        }
    },

    deleteCategory: async (req, res) => {
        try {
            let result = await Category.destroy({ where: { categoryID: req.params.categoryID } })
            if (result == 1)
                return res.status(201).send({
                    message: `Category deleted successfully.`
                });
            else {
                res
                    .status(404)
                    .send({
                        messsage: "Category not found",
                    });
            }
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later.",
                details: error,
            });
        }
    },
    getSubCategories: async (req, res) => {
        try {
            const subCategories = await paginate(SubCategory, {where: {categoryID: res.locals.categoryID}})
            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage
            const links = [
                { rel: "addSubCategories", href: "/subCategories", method: "POST" },
                { rel: "deleteSubCategories", href: "/subCategories/:subCategoryID", method: "DELETE" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];
            return res.status(200).send(
                {
                    pagination: subCategories.pagination,
                    data: subCategories.data,
                    links: links
                });
        } catch (error) {
            return res.status(500).send({
                message: error.message || "Something went wrong. Please try again later."
            });
        }
    },
    addSubCategory: async (req, res) => {
        try {
            // Verify if the SubCategory and CategoryID is provided in the body
            if (!req.body.subCategoryName) {
                return res.status(400).send({
                    message: "Please fill all the required fields."
                })
            }
            //Create and Save in the database
            await SubCategory.create({
                subCategoryName: req.body.subCategoryName,
                categoryID: req.params.categoryID
            })
            return res.status(201).send({
                message: "New SubCategory created with success."
            })
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // Capture Sequelize Validation Errors
                const messages = error.errors.map(err => ({
                    message: `Invalid Data Format on ${err.path}`
                }))
                return res.status(400).send({ errors: messages })
            }
            res.status(500).send({
                message: error.message || "Something went wrong. Please try again later."
            })
        }
    },
    delSubCategory: async (req, res) => {
        try {
            const subCategory = res.locals.subCategory

            //Destroys the SubCategory if it exists
            await SubCategory.destroy({ where: { subCategoryID: subCategory.subCategoryID } })

            res.status(204).send({ message: "SubCategory deleted successfully." })
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            })
        }
    },
}