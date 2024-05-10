const express = require('express');
const router = express.Router();

// import users controller
const usersController = require("../controllers/users.controller");

router.route('/users')
    .get(usersController.getUsers)

router.route('/users/login')
    .post(usersController.login)

router.route('/user')
    .post(usersController.register)

router.route('/users/me')
    .get(usersController.getUser)
    .patch(usersController.editProfile)

router.route('/users')
    .post(usersController.register)

router.route('/users/:userID')
    .patch(usersController.banUser)

router.all('*', (req, res) => {
    res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;