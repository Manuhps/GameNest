const express = require('express');
const router = express.Router();

// import genres controller 
const gameModeController = require("../controllers/gameMode.controller");

router.route('/gameMode')
    .get(gameModeController.findAllGameMode)
    .post(gameModeController.creategameMode);

router.route('/gameMode/:gameModeID')
    .delete(gameModeController.deleteGameMode);

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;