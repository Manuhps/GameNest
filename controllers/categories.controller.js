const express = require('express');
const router = express.Router();
const category = require('../models/category.model'); 
const { verifyAdmin } = require("../middlewares/jwt");

module.exports = {
    findAllCategory : async (req, res) => {
        try {
            /*
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
            }
        
            await verifyAdmin(req, res);
        */
            const page = req.query.page ? parseInt(req.query.page) : 0;
        
            if (page < 0 || !Number.isInteger(page)) {
                return res.status(400).send({ message: "Page must be 0 or a positive integer" });
            }
        
            const limit = 5; 
        
            const offset = page * limit;
        
            const categories = await category.findAll({
                offset: offset,
                limit: limit
            });

            const nextPage = `/users?page=${page + 1}`;
            const prevPage = page > 0 ? `/users?page=${page - 1}` : null;

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
        /*try {
            // Validação de requisição
            
            if (!req.body.category || typeof req.body.category !== 'string') {
                return res.status(400).send({
                    message: "Category name must be a non-empty string"
                });
            }

            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
            }

            await verifyAdmin(req, res);

            const existingCategory = await category.findOne({ CategoryName: req.body.category }); 
    
            // Se a categoria já existir, retorna um erro 409 (Conflito)
            if (existingCategory) {
                return res.status(409).send({
                    message: "A category with that name already exists."
                });
            }
            
    */

            if (req.body.categoryName) {
                if (await category.findOne({ where: { categoryName: req.body.categoryName } })) {
                    res.status(409).send({ message: "Category already exists" });
                }
            }

            if (!req.body) {
                return res.status(400).send({
                    message: "Category content can not be empty"
                });
            }
    
            // Salva a categoria no banco de dados
            const categories = new category({
                categoryName: req.body.categoryName,
            });
    
            
            try {
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
/*
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
            }

            await verifyAdmin(req, res);
*/
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



