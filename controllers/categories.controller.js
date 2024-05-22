const express = require('express');
const router = express.Router();
const category = require('../models/category.model'); 
const { paginatedResults, generatePaginationPath } = require("../middlewares/pagination")

module.exports = {
    findAllCategory : async (req, res) => {
        try {
            

        
            const categories = await paginatedResults(req, res, 5, category) //Sends the parameters req, res, limit(per page) and Model and returns the paginated list of users

            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage

            const links = [
                { rel: "createCategory", href: "/categories", method: "POST" },
                { rel: "deleteCategory", href: "/categories/:categoryID", method: "DELETE" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];

            console.log('success');
            res.status(200).send({categories: categories, links: links});
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        }  
    },

    createCategory : async (req, res) => {
        try {
            
            
            if (!req.body.categoryName) {
                return res.status(400).send({
                    message: "Category name must be a non-empty string"
                });
            }

            if (req.body.categoryName) {
                const existingCategory = await category.findOne({ where: { categoryName: req.body.categoryName } });
                    if (existingCategory) {
                        return res.status(409).send({ message: "Category already exists" });
                    }
            }

            
    
            // Salva a categoria no banco de dados
            const categories = new category({
                categoryName: req.body.categoryName,
            });
    
            
            
                const data = await categories.save();
                res.status(201).send({
                    message:"New category created with success."
                });
            } catch (err) {
                res.status(500).send({
                    message: err.message || "Something went wrong. Please try again later."
                });
            }
    },

    deleteCategory : async (req, res) => {
        try {



            let result = await category.destroy({ where: { categoryID: req.params.categoryID}})
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
}



