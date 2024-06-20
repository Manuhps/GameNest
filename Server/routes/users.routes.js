const express = require('express');
const router = express.Router();
const multer = require('multer');

// Define the storage engine
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const multerUploads = multer({ storage }).single('image');

// import users controller
const { login, getUsers, register, getSelf, editProfile, banUser } = require("../controllers/users.controller");
const { verifyUser, verifyAdmin } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken");
const { checkIsBanned } = require('../middlewares/checkIsBanned');

router.route('/')
    .post(multerUploads, register) // Use the Multer middleware here
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