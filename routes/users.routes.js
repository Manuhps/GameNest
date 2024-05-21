const express = require('express');
const router = express.Router();

// import users controller
const { login, getUsers, register, getSelf, editProfile, banUser } = require("../controllers/users.controller");
const { verifyUser, verifyAdmin, SignToken } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken")

router.route('/')
    .post(register)
    .get(checkToken, verifyAdmin, getUsers)

router.route('/login')
    .post(login)
    
router.route('/me')
    .get(checkToken, verifyUser, getSelf)
    .patch(checkToken, verifyUser, editProfile)

router.route('/:userID')
    .patch(checkToken, verifyAdmin, banUser)

router.all('*', (req, res) => {
     res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;