const express = require('express');
const router = express.Router();

// import controller middleware
const genresController = require("../controllers/genres.controller");

router.route('/genre')
    .get(genresController.findAllGenre)
    .post(genresController.createGenre);

router.route('/genre/:genreID')
    .delete(genresController.deleteGenre);

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;