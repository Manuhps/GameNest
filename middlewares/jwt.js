const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
const secret = process.env.SECRET;

module.exports = {
    verifyUser: async (req, res, next) => {
        console.log(secret);
        try {
            const bearer = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(bearer, secret);

            console.log(payload);

            const user = await User.findByPk(payload.id);

            if (user != null) {
                res.locals.userID = payload.id;
                next();
            } else {
                res.status(401).send({ message: "Invalid Credentials" });
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).send({ message: "Your token has expired! Please login again." });
            }
            res.status(401).send({ message: "Token failed verification" });
        }
    },
    verifyAdmin: async (req, res, next) => {
        try {
            const bearer = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(bearer, secret);

            console.log(payload);

            const user = await User.findByPk(payload.id);

            if (user != null) {
                if (user.role == 'admin') {
                    res.locals.userID = payload.id;
                    next();
                } else {
                    res.status(403).send({ message: "This action requires admin privileges." });
                }
            } else {
                res.status(401).send({ message: "User does not exist" });
            }
        } catch (error) {
            res.status(401).send({ message: "Token failed verification" });
        }
    },

    SignToken: async (userID) => {
        const payload = { id: userID };
        console.log(jwt.sign(payload, secret));
        return jwt.sign(payload, secret);
    },
};
