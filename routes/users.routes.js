const express = require('express');
const router = express.Router();

// import users controller
const usersController = require("../controllers/users.controller");

router.route('/')
    .post(usersController.register)
    .get(usersController.getUsers)

router.route('/login')
    .post(usersController.login)


router.route('/me')
    // .get(usersController.getUser)
    .patch(usersController.editProfile)

router.route('/:userID')
// .patch(usersController.banUser)

router.all('*', (req, res) => {
     res.status(404).json({ message: '404 Not Found' }); //send a predefined error message
})

//export this router
module.exports = router;