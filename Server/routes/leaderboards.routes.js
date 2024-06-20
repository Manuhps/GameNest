const express = require('express');
const router = express.Router();

const { getMostOrders, getMostSpent, getMostReviews } = require("../controllers/leaderboards.controller");

router.route('/mostOrders')
    .get(getMostOrders)

router.route('/mostSpent')
    .get(getMostSpent)

router.route('/mostReviews')
    .get(getMostReviews)

router.all('*', (req, res) => {
     res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;
