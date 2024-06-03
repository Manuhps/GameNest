const { Review } = require('../models/index')

module.exports = {
    checkReview: async(req, res, next) => {
        try {
            const reviewID = req.params.reviewID
            const review = await Review.findByPk(reviewID)
            if (!review) {
                res.status(404).send({ message: "Review Not Found" })
            }
            next()
        } catch (error) {
            res.status(500).send({ message: "Something went wrong. Please try again later.", details: error.message })
        }
    }
}