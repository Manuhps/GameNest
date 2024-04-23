const express = require('express');
const router = express.Router();
// import controller middleware
const moviesController = require("../controllers/movies.controller");

router.route('/')
    .get(moviesController.findAll)
    .post(moviesController.bodyValidator, moviesController.create);

router.route('/:id')
    .get(moviesController.findOne)
    .put(moviesController.bodyValidator, moviesController.update)
    .delete(moviesController.delete);

router.all('*', (req, res) => {
    res.status(404).json({ message: 'MOVIES: what???' }); //send a predefined error message
})

//export this router
module.exports = router;