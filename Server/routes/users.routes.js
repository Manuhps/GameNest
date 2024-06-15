const express = require('express');
const router = express.Router();

// import users controller
const { login, getUsers, register, getSelf, editProfile, banUser } = require("../controllers/users.controller");
const { verifyUser, verifyAdmin } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken");
const { checkIsBanned } = require('../middlewares/checkIsBanned');

router.route('/')
    .post(register)
    .get(checkToken, verifyAdmin, checkIsBanned, getUsers)

router.route('/login')
    .post(login)
    
router.route('/me')
    .get(checkToken, verifyUser, checkIsBanned, getSelf)
    .patch(checkToken, verifyUser, checkIsBanned, editProfile)

router.route('/:userID')
    .patch(checkToken, verifyAdmin, checkIsBanned, banUser)

router.all('*', (req, res) => {
     res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;