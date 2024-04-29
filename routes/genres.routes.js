const express = require('express');
const router = express.Router();

// import controller middleware
const genresController = require("../controllers/genres.controller");

router.route('/')
    .get(genresController.findAll)
    .post(genresController.bodyValidator, genresController.create);

router.route('/:id')
    .get(genresController.findOne)
    .put(genresController.bodyValidator, genresController.update)
    .delete(genresController.delete);

router.all('*', (req, res) => {
    res.status(404).json({ message: 'genres: what???' }); //send a predefined error message
})

//export this router
module.exports = router;