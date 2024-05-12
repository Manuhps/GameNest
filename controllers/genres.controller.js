const Genre = require('../models/genre.model'); 
const { verifyAdmin } = require("./jwt");

module.exports = {
    findAllGenre : async (req, res) => {
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
        
            const genres = await Genre.findAll({
                offset: offset,
                limit: limit
            });

            res.status(200).send({genres: genres});
        }   catch(error) {
                res.status(500).send({
                    message: err.message || "Something went wrong. Please try again later.",
                    details: error,
                });
            }   
    },
          
    createGenre : async (req, res) => {
        try {
            // Validação de requisição
            if (!req.body.genre || typeof req.body.genre !== 'string') {
                return res.status(400).send({
                    message: "Genre name must be a non-empty string"
                });
            }

            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
            }

            await verifyAdmin(req, res);
    
            // Verifica se o gênero já existe no banco de dados
            const existingGenre = await Genre.findOne({ GenreName: req.body.genre }); 
    
            // Se o gênero já existir, retorna um erro 409 (Conflito)
            if (existingGenre) {
                return res.status(409).send({
                    message: "A genre with that name already exists."
                });
            }
    
            // Cria um novo gênero se não existir
            const newGenre = new Genre({
                GenreName: req.body.genre
            });
    
            // Salva o gênero no banco de dados
            const savedGenre = await newGenre.save();
    
            // Responde com o gênero recém-criado
            res.status(201).send(savedGenre);
        } catch (error) {
            // Trata quaisquer outros erros
            res.status(500).send({
                message: "Something went wrong. Please try again later.",
                details: error,
            });
        }
    },

    deleteGenre : async (req, res) => {
        try {

            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
              }

            await verifyAdmin(req, res);

            let result = await Genre.destroy({ where: { id: req.params.id}})
            if (result == 1)
                return res.status(204).send({
                     msg: `Genre deleted successfully.`
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



