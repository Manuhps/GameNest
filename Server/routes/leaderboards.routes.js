const express = require('express');
const router = express.Router();

// import products controller
const { getMostOrders, getMostSpent } = require("../controllers/leaderboards.controller");

router.route('/mostOrders')
    .get(getMostOrders)

router.route('/mostSpent')
    .get(getMostSpent)

router.route('/mostReviews')
    // .post(getMostReviews)

router.all('*', (req, res) => {
     res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;
