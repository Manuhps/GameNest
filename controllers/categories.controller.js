const express = require('express');
const router = express.Router();
const Category = require('../models/category.model'); 

exports.findAllCategory = (req, res) => {
    Category.find() // 
        .then(category => { 
            res.send(category);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        });
};

exports.findOneCategory = (req, res) => {
    Category.findById(req.params.id) 
        .then(category => { 
            res.send(category);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Category not found with id " + req.params.id
                });
            } else {
                res.status(500).send({
                    message: "Something went wrong. Please try again later"
                });
            }
        });
};

exports.createCategory = async (req, res) => {
    try {
        // Validação de requisição
        if (!req.body.category || typeof req.body.category !== 'string') {
            return res.status(400).send({
                message: "Category name must be a non-empty string"
            });
        }

        // Verifica se a categoria já existe no banco de dados
        const existingCategory = await Category.findOne({ CategoryName: req.body.category }); 

        // Se a categoria já existir, retorna um erro 409 (Conflito)
        if (existingCategory) {
            return res.status(409).send({
                message: "A category with that name already exists."
            });
        }

        // Cria uma nova categoria se não existir
        const newCategory = new Category({
            CategoryName: req.body.category
        });

        // Salva a categoria no banco de dados
        const savedCategory = await newCategory.save();

        // Responde com a categoria recém-criada
        res.status(201).send(savedCategory);
    } catch (err) {
        // Trata quaisquer outros erros
        res.status(500).send({
            message: "Something went wrong. Please try again later."
        });
    }
};

module.exports = router;
