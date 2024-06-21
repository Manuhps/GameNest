const express = require('express');
const GameMode = require('../models/gameMode.model');
const { paginate, generatePaginationPath } = require("../utilities/pagination");
const { handleServerError, handleNotFoundError } = require('../utilities/errors');

module.exports = {
    findAllGameMode: async (req, res) => {
        try {
            const gameModes = await paginate(GameMode, { attributes: ['gameModeID', 'gameModeName'] })
            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage
            const links = [
                { rel: "createGameMode", href: "/gameMode", method: "POST" },
                { rel: "deleteGameMode", href: "/gameMode/:gameModeID", method: "DELETE" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];
            return res.status(200).send(
                {
                    pagination: gameModes.pagination,
                    data: gameModes.data,
                    links: links
                });
        } catch (error) {
            handleServerError(error, res)
        }
    },
    createGameMode: async (req, res) => {
        try {
            //Verify if the gameMode is empty
            if (!req.body.gameModeName) {
                return res.status(400).send({
                    message: "GameModeName cannot be empty"
                });
            }
            if (req.body.gameModeName) {
                const existingGameMode = await GameMode.findOne({ where: { gameModeName: req.body.gameModeName } });
                if (existingGameMode) {
                    return res.status(409).send({ message: "A GameMode with that name already exists." });
                }
            }
            const regex = /^[A-Za-z\s]+$/;
            if (!regex.test(req.body.gameModeName)) {
                return res.status(400).send({
                    message: "GameModeName must be a string"
                });
            }
            // Create and Save GameMode in the databsae
            await GameMode.create({
                gameModeName: req.body.gameModeName,
            });
            return res.status(201).send({
                message: "New Game Mode created with success."
            });
        } catch (error) {
            handleServerError(error, res)
        }
    },

    deleteGameMode: async (req, res) => {
        try {
            let result = await GameMode.destroy({ where: { gameModeID: req.params.gameModeID } })
            if (result == 1)
                return res.status(201).send({
                    message: `Game Mode deleted successfully.`
                });
            else {
                handleNotFoundError(res, "Game Mode Not Found")
            }
        } catch (error) {
            handleServerError(error, res)
        }
    }
}