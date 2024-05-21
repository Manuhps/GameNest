module.exports = {
    checkToken: async (req, res, next) => {
        // Check if the token was provided
        if (!req.headers.authorization) {
            res.status(401).send({ message: "No access token provided" });
        }
        next()
    }
}