const jwt = require("jsonwebtoken");
const { User } = require("../models/index");
const secret = process.env.SECRET;

module.exports = {
    verifyUser: async (req, res, next) => {
        try {
            const bearer = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(bearer, secret);
            if (!payload) {
                return res.status(401).send({ message: "Token failed verification" });
            }
            const user = await User.findByPk(payload.id);
            if (user != null) {
                res.locals.userID = payload.id;
                next();
            } else {
                return res.status(401).send({ message: "Invalid Credentials" });
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).send({ message: "Your token has expired! Please login again." });
            }
        }
    },
    verifyAdmin: async (req, res, next) => {
        try {
            const bearer = req.headers.authorization.split(" ")[1];
            const payload = jwt.verify(bearer, secret);
            const user = await User.findByPk(payload.id);
            if (user != null) {
                if (user.role == 'admin') {
                    res.locals.userID = payload.id;
                    next();
                } else {
                    return res.status(403).send({ message: "This action requires admin privileges." });
                }
            } else {
                return res.status(404).send({ message: "User Not Found" });
            }
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return res.status(401).send({ message: "Your token has expired! Please login again." });
            }
        }
    },
    SignToken: async (userID) => {
        const payload = { id: userID };
        return jwt.sign(payload, secret, { expiresIn: "24h"});
    }
};
