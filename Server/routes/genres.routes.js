const express = require('express');
const router = express.Router();

// import genres controller 
const { findAllGenre, createGenre, deleteGenre } = require("../controllers/genres.controller");
const { verifyAdmin } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken")
const { checkIsBanned } = require("../middlewares/checkIsBanned")

router.route('/')
    .get(checkToken, verifyAdmin, checkIsBanned, findAllGenre)
    .post(checkToken, verifyAdmin, checkIsBanned, createGenre);

router.route('/:genreID')
    .delete(checkToken, verifyAdmin, checkIsBanned, deleteGenre);

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;