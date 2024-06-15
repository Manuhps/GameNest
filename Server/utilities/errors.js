module.exports = {
    handleSequelizeValidationError: (error, res) => {
        const messages = error.errors.map(err => ({
            message: `Invalid Data Format on ${err.path}`
        }));
        return res.status(400).send({ errors: messages });
    },
    handleJsonWebTokenError: (res) => {
        return res.status(401).send({ message: "Your token has expired! Please login again." });
    },
    handleServerError: (error, res) => {
        console.log(error);
        return res.status(500).send({
            message: "Something went wrong. Please try again later",
            details: error,
        })
    },
    handleBadRequest: (res, message) => {
        return res.status(400).send({ message })
    },
    handleInvalidRequest: (res, message) => {
        return res.status(401).send({ message })
    },
    handleForbiddenRequest: (res, message) => {
        return res.status(403).send({ message })
    },
    handleNotFoundError: (res, message) => {
        return res.status(404).send({ message })
    },
    handleConflictError: (res, message) => {
        return res.status(409).send({ message })
    }
}