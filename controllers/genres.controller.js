const Genre = require('../models/genre.model'); 

module.exports = {
    findAllGenre : (req, res) => {
        Genre.find() // 
            .then(genre => { 
                res.send(genre);
            }).catch(err => {
                res.status(500).send({
                    message: err.message || "Something went wrong. Please try again later."
                });
            });
    },
    
    createGenre : async (req, res) => {
        try {
            // Validação de requisição
            if (!req.body.genre || typeof req.body.genre !== 'string') {
                return res.status(400).send({
                    message: "Genre name must be a non-empty string"
                });
            }
    
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
        } catch (err) {
            // Trata quaisquer outros erros
            res.status(500).send({
                message: "Something went wrong. Please try again later."
            });
        }
    },
}



