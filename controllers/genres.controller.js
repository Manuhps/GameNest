const express = require('express');
const router = express.Router();
const genre = require('../models/genre.model'); 
const { verifyAdmin } = require("../middlewares/jwt");

module.exports = {
    findAllGenre : async (req, res) => {
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
        
            const genres = await genre.findAll({
                offset: offset,
                limit: limit
            });

            const nextPage = `/users?page=${page + 1}`;
            const prevPage = page > 0 ? `/users?page=${page - 1}` : null;

            const links = [
                { rel: "createGenre", href: "/genre", method: "POST" },
                { rel: "deleteGenre", href: "/genre/:genreID", method: "DELETE" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];

            console.log('success');
            res.status(200).send({genres: genres, links: links});
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        }   
    },
          
    createGenre : async (req, res) => {
        /*try {
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

            const existingGenre = await Genre.findOne({ GenreName: req.body.genre }); 
    
            // Se o gênero já existir, retorna um erro 409 (Conflito)
            if (existingGenre) {
                return res.status(409).send({
                    message: "A genre with that name already exists."
                });
            }
            */
    

        
            if (!req.body) {
                return res.status(400).send({
                    message: "Genre content can not be empty"
                });
            }
    
            // Salva o gênero no banco de dados
            const genres = new genre({
                genreName: req.body.genreName,
            });
    
            
            try {
                const data = await genres.save();
                res.status(201).send({
                    message:"New genre created with success."
                });
            } catch (err) {
                res.status(500).send({
                    message: err.message || "Something went wrong. Please try again later."
                });
            }
    },

    deleteGenre : async (req, res) => {
        try {
            /*
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
              }

            await verifyAdmin(req, res);
            */

            let result = await genre.destroy({ where: { genreID: req.params.genreID}})
            if (result == 1)
                return res.status(201).send({
                     msg: `Genre deleted successfully.`
            
                });
            else {
                res
                    .status(404)
                    .send({
                        messsage: "Genre not found",
                    });
            }
        }
        catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later.",
                details: error,
            });
        }
    },
}