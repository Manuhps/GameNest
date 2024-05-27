const express = require('express');
const router = express.Router();
const gameMode = require('../models/gameMode.model');
const { paginatedResults, generatePaginationPath } = require("../middlewares/pagination")

module.exports = {
    findAllGameMode : async (req, res) => {
        try {
            
            const gameModes = await paginatedResults(req, res, 5, gameMode) //Sends the parameters req, res, limit(per page) and Model and returns the paginated list of users

            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage

            const links = [
                { rel: "createGameMode", href: "/gameMode", method: "POST" },
                { rel: "deleteGame", href: "/categories/:gameModeID", method: "DELETE" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];

            console.log('success');
            res.status(200).send({gameMode: gameModes, links: links});
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        }  
    },

    createGameMode : async (req, res) => {
        
            if (!req.body) {
                return res.status(400).send({
                    message: "Game mode must be a non-empty string"
                });
            }

            if (req.body.gameModeName) {
                const existingGameMode = await gameMode.findOne({ where: { gameModeName: req.body.gameModeName } });
                    if (existingGameMode) {
                        return res.status(409).send({ message: "Game mode already exists" });
                    }
            }

    
            // Salva o game mode no banco de dados
            const gameModes = new gameMode({
                gameModeName: req.body.gameModeName,
            });
    
            
            try {
                const data = await gameModes.save();
                res.status(201).send({
                    message:"New game mode created with success."
                });
            } catch (err) {
                res.status(500).send({
                    message: err.message || "Something went wrong. Please try again later."
                });
            }
    },

    deleteGameMode : async (req, res) => {
        try {
            let result = await gameMode.destroy({ where: { gameModeID: req.params.gameModeID}})
            if (result == 1)
                return res.status(201).send({
                     msg: `Game Mode deleted successfully.`
            
                });
            else {
                res
                    .status(404)
                    .send({
                        messsage: "Game mode not found",
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


