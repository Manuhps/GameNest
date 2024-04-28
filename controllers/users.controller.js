// import users data
const users = require("../models/user.model");

// exports custom request payload validation middleware
exports.bodyValidator = (req, res, next) => {
    if (req.body.username && req.body.email && req.body.address && req.body.password && req.body.role && req.body.isBanned && req.body.postalCode ) {
        next()
    }else{
        console.log("Something went wrong...")
    }
};

// Display list of all users
exports.getUsers = (req, res) => {
    res.json(users);
};
// Display only 1 movies
exports.getUser = (req, res) => {
    res.send("GET movie: HELLO")
};

exports.createUser = (req, res) => {
    res.send("POST movie: HELLO");
};

exports.update = (req, res) => {
    res.send("PATCH movie: HELLO");
};
