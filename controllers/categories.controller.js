const Category = require('../models/category.model'); 
const { verifyAdmin } = require("./jwt");

module.exports = {
    findAllCategory : async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
            }
        
            await verifyAdmin(req, res);
        
            const page = req.query.page ? parseInt(req.query.page) : 0;
        
            if (page < 0 || !Number.isInteger(page)) {
                return res.status(400).send({ message: "Page must be 0 or a positive integer" });
            }
        
            const limit = 5; 
        
            const offset = page * limit;
        
            const categories = await Category.findAll({
                offset: offset,
                limit: limit
            });

            res.status(200).send({categories: categories});
        }   catch(error) {
                res.status(500).send({
                    message: err.message || "Something went wrong. Please try again later.",
                    details: error,
                });
            }   
    },

    createCategory : async (req, res) => {
        try {
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
        } catch (error) {
            // Trata quaisquer outros erros
            res.status(500).send({
                message: "Something went wrong. Please try again later.",
                details: error,
            });
        }
    },

    deleteCategory : async (req, res) => {
        try {

            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
            }

            await verifyAdmin(req, res);

            let result = await Category.destroy({ where: { id: req.params.id}})
            if (result == 1)
                return res.status(204).send({
                     msg: `Category deleted successfully.`
                });
        }
        catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later.",
                details: error,
            });
        }
    },
}




