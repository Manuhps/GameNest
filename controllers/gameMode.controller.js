const express = require('express');
const router = express.Router();
const gameMode = require('../models/gameMode.model');
const { verifyAdmin } = require("./jwt");

exports.findAllGameMode = async (req, res) => {
    try {
        /*
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "No access token provided" });
        }
    */
        //await verifyAdmin(req, res);
    
        const page = req.query.page ? parseInt(req.query.page) : 0;
    
        if (page < 0 || !Number.isInteger(page)) {
            return res.status(400).send({ message: "Page must be 0 or a positive integer" });
        }
    
        const limit = 5; 
    
        const offset = page * limit;
    
        const gameModes = await gameMode.find().skip(offset).limit(limit);
    
        res.status(200).send({gameModes: gameModes});
    } catch(error) {
        res.status(500).send({
            message: error.message || "Something went wrong. Please try again later.",
            details: error,
        });
    }   
};


exports.createGameMode = async (req, res) => {
    // Authorization check
    /*
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "No access token provided" });
    }
*/
    //await verifyAdmin(req, res);

    // Request validation
    if(!req.body) {
        return res.status(400).send({
            message: "GameMode content can not be empty"
        });
    }

    // Create a new GameMode
    const gameMode = new GameMode({
        gameModeName: req.body.gameModeName, 
        // other fields as necessary
    });

    // Save the GameMode in the database
    try {
        const data = await gameMode.save();
        res.send(data);
    } catch(err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the GameMode."
        });
    }
};

exports.deleteGameMode = async (req, res) => {
    // Authorization check
    //if (!req.headers.authorization) {
        //return res.status(401).send({ message: "No access token provided" });
   // }

    //await verifyAdmin(req, res);

    // Request validation
    if(!req.body) {
        return res.status(400).send({
            message: "GameMode content can not be empty"
        });
    }

    // Delete the GameMode from the database
    try {
        const data = await GameMode.deleteOne({ _id: req.body.id });
        res.send(data);
    } catch(err) {
        res.status(500).send({
            message: err.message || "Some error occurred while deleting the GameMode."
        });
    }
};


module.exports = router;