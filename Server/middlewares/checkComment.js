const { Review } = require('../models/index')

module.exports = {
    checkComment: async(req, res, next) => {
        try {
            const reviewID = req.params.reviewID
            const review = await Review.findByPk(reviewID)
            const comment = review.comment

            if (!comment) {
                res.status(404).send({ message: "Comment Not Found" })
            }
            next()
        } catch (error) {
            res.status(500).send({ message: "Something went wrong. Please try again later.", details: error.message })
        }
    }
}