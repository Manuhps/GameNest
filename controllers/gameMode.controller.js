const express = require('express');
const router = express.Router();
const gameMode = require('../models/gameMode.model');
const { verifyAdmin } = require("../middlewares/jwt");

module.exports = {
    findAllGameMode : async (req, res) => {
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
        
            const gameMode = await gameMode.findAll({
                offset: offset,
                limit: limit
            });

            const nextPage = `/users?page=${page + 1}`;
            const prevPage = page > 0 ? `/users?page=${page - 1}` : null;

            const links = [
                { rel: "createGameMode", href: "/gameMode", method: "POST" },
                { rel: "deleteGameMode", href: "/gameMode/:gameModeID", method: "DELETE" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];

            console.log('success');
            res.status(200).send({gameMode: gameMode, links: links});
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        }   
    },

    createGameMode : async (req, res) => {
        /*try {
            // Validação de requisição
            
            if (!req.body.gameMode || typeof req.body.gameMode !== 'string') {
                return res.status(400).send({
                    message: "Game mode name must be a non-empty string"
                });
            }

            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
            }

            await verifyAdmin(req, res);

            const existingGameMode = await gameMode.findOne({ gameMode: req.body.gameMode }); 
    
            // Se o game mode já existir, retorna um erro 409 (Conflito)
            if (existingGameMode) {
                return res.status(409).send({
                    message: "A game mode with that name already exists."
                });
            }
            */
    

        
            if (!req.body) {
                return res.status(400).send({
                    message: "Genre content can not be empty"
                });
            }
    
            // Salva o gênero no banco de dados
            const gameMode = new gameMode({
                gameModeName: req.body.gameModeName,
            });
    
            
            try {
                const data = await gameMode.save();
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
            /*
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
              }
    
            await verifyAdmin(req, res);
            */
    
            let result = await gameMode.destroy({ where: { gameModeID: req.params.gameModeID}})
            if (result == 1)
                return res.status(201).send({
                     msg: `Game Mode deleted successfully.`
            
                });
            else {
                res
                    .status(404)
                    .send({
                        messsage: "Game Mpde not found",
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


