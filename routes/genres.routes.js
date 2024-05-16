const express = require('express');
const router = express.Router();

// import genres controller 
const genresController = require("../controllers/genres.controller");

router.route('/')
    .get(genresController.findAllGenre)
    .post(genresController.createGenre);

router.route('/:genreID')
    .delete(genresController.deleteGenre);

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;