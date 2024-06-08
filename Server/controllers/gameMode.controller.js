const express = require('express');
const router = express.Router();
const GameMode = require('../models/gameMode.model');
const { paginate, generatePaginationPath } = require("../utilities/pagination")

module.exports = {
    findAllGameMode: async (req, res) => {
        try {
            const gameModes = await paginate(GameMode) //Sends the parameters req, res, limit(per page) and Model and returns the paginated list of users
            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage
            const links = [
                { rel: "createGameMode", href: "/gameMode", method: "POST" },
                { rel: "deleteGame", href: "/categories/:gameModeID", method: "DELETE" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];
            res.status(200).send(
                {
                    pagination: gameModes.pagination,
                    data: gameModes.data,
                    links: links
                });
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        }
    },
    createGameMode: async (req, res) => {
        try {
            //Verify if the gameMode is empty
            if (!req.body.gameModeName) {
                return res.status(400).send({
                    message: "GameMode content cannot be empty"
                });
            }
            if (req.body.gameModeName) {
                const existingGameMode = await GameMode.findOne({ where: { gameModeName: req.body.gameModeName } });
                if (existingGameMode) {
                    return res.status(409).send({ message: "GameMode already exists" });
                }
            }
            // Create and Save GameMode in the databsae
            await GameMode.create({
                gameModeName: req.body.gameModeName,
            });
            res.status(201).send({
                message: "New GameMode created with success."
            });
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        }
    },

    deleteGameMode: async (req, res) => {
        try {
            let result = await GameMode.destroy({ where: { gameModeID: req.params.gameModeID } })
            if (result == 1)
                return res.status(201).send({
                    msg: `Game Mode deleted successfully.`
                });
            else {
                res
                    .status(404)
                    .send({
                        messsage: "Game Mode not found",
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