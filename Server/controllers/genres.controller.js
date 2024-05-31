const express = require('express');
const router = express.Router();
const genre = require('../models/genre.model'); 
const { generatePaginationPath } = require("../middlewares/pagination")

module.exports = {
    findAllGenre : async (req, res) => {
        try {
            

            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage

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
        try {
            // Validação de requisição
            

            // Verifica se o gênero é vazio antes de qualquer coisa
            if (!req.body.genreName) {
                return res.status(400).send({
                    message: "Genre content cannot be empty"
                });
            }


            if (req.body.genreName) {
                const existingGenre = await genre.findOne({ where: { genreName: req.body.genreName } });
                    if (existingGenre) {
                        return res.status(409).send({ message: "Genre already exists" });
                    }
            }



            // Salva o gênero no banco de dados
            const genres = new genre({
                genreName: req.body.genreName,
            });
    
            
            
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