const express = require('express');
const router = express.Router();
const gameMode = require('../models/gameMode.model');

exports.findAllGameMode = (req, res) => {
    gameMode.find()
        .then(gameModes => {
            res.send(gameModes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Something went wrong while getting list of gameModes."
            });
        });
};

exports.findOneGameMode = (req, res) => {
    gameMode.findById(req.params.id)
        .then(gameMode => {
            if (!gameMode) {
                return res.status(404).send({
                    message: "GameMode not found with id " + req.params.id
                });
            }
            res.send(gameMode);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "GameMode not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Something went wrong getting gameMode with id " + req.params.id
            });
        });
};

exports.createGameMode = (req, res) => {
    // Validação de requisição
    if(!req.body) {
        return res.status(400).send({
            message: "GameMode content can not be empty"
        });
    }

    // Cria um novo GameMode
    const gameMode = new GameMode({
        gameModeName: req.body.gameModeName, 
        // outros campos conforme necessário
    });

    // Salva o GameMode no banco de dados
    gameMode.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the GameMode."
        });
    });
};

exports.updateGameMode = (req, res) => {
    // Validação de requisição
    if(!req.body) {
        return res.status(400).send({
            message: "GameMode content can not be empty"
        });
    }

    // Encontra o game mode e atualiza com o corpo da requisição
    GameMode.findByIdAndUpdate(req.params.id, {
        gameModeName: req.body.gameModeName,
        // outros campos conforme necessário
    }, {new: true})
    .then(gameMode => {
        if(!gameMode) {
            return res.status(404).send({
                message: "GameMode not found with id " + req.params.id
            });
        }
        res.send(gameMode);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "GameMode not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error updating gameMode with id " + req.params.id
        });
    });
};

module.exports = router;