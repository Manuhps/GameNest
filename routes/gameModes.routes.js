const express = require('express');
const router = express.Router();
// import controller middleware
const gameModeController = require("../controllers/gameMode.controller");

router.route('/')
    .get(gameModeController.findAll)
    .post(gameModeController.bodyValidator, gameModeController.create);

router.route('/:id')
    .get(gameModeController.findOne)
    .put(gameModeController.bodyValidator, gameModeController.update)
    .delete(gameModeController.delete);

router.all('*', (req, res) => {
    res.status(404).json({ message: 'gameMode: what???' }); //send a predefined error message
})

//export this router
module.exports = router;