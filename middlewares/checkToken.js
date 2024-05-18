module.exports = {
    checkToken: async (req, res) => {
        // Check if the token was provided
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "No access token provided" });
        }
    }
}