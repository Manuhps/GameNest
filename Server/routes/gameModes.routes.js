const express = require('express');
const router = express.Router();

// import categories controller 
const { findAllGameMode, createGameMode, deleteGameMode } = require("../controllers/gameMode.controller");
const { verifyAdmin } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken")
const { checkIsBanned } = require("../middlewares/checkIsBanned")

router.route('/')
    .get(checkToken, verifyAdmin, checkIsBanned, findAllGameMode)
    .post(checkToken, verifyAdmin, checkIsBanned, createGameMode);

router.route('/:gameModeID')
    .delete(checkToken, verifyAdmin, checkIsBanned, deleteGameMode);

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;