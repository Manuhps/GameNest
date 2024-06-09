const express = require('express');
const router = express.Router();
const Category = require('../models/category.model');
const { generatePaginationPath } = require("../utilities/pagination")

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
    }
}