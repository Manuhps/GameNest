const express = require('express');
const router = express.Router();
const Genre = require('../models/genre.model');
const { paginate, generatePaginationPath } = require("../utilities/pagination")

module.exports = {
    findAllGenre: async (req, res) => {
        try {
            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage
            const genres = await paginate(Genre, {attributes: ['genreID', 'genreName']})
            const links = [
                { rel: "createGenre", href: "/genre", method: "POST" },
                { rel: "deleteGenre", href: "/genre/:genreID", method: "DELETE" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];
            res.status(200).send(
                {
                    pagination: genres.pagination,
                    data: genres.data,
                    links: links
                }
            );
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        }
    },
    createGenre: async (req, res) => {
        try {
            // Verifica se o gênero é vazio antes de qualquer coisa
            if (!req.body.genreName) {
                return res.status(400).send({
                    message: "Genre content cannot be empty"
                });
            }
            if (req.body.genreName) {
                const existingGenre = await Genre.findOne({ where: { genreName: req.body.genreName } });
                if (existingGenre) {
                    return res.status(409).send({ message: "Genre already exists" });
                }
            }

            const regex = /^[A-Za-z\s]+$/;
            if (!regex.test(req.body.genreName)) {
                return res.status(400).send({
                    message: "Genre name must be a string"
                });
            }

            // Salva o gênero no banco de dados
            await Genre.create({
                genreName: req.body.genreName,
            });
            res.status(201).send({
                message: "New genre created with success."
            });
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        }
    },
    deleteGenre: async (req, res) => {
        try {
            let result = await Genre.destroy({ where: { genreID: req.params.genreID } })
            if (result == 1)
                return res.status(201).send({
                    message: `Genre deleted successfully.`
                });
            else {
                res
                    .status(404)
                    .send({
                        message: "Genre not found",
                    });
            }
        }
        catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later.",
                details: error,
            });
        }
    }
}