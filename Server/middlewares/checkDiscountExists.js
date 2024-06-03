const { Discount } = require('../models/index')

module.exports = {
    checkDiscountExists: async(req, res, next) => {
        try {
            const discountID = req.params.discountID
            const discount = await Discount.findByPk(discountID)
            if (!discount) {
                res.status(404).send({ message: "Discount Not Found" })
            }
            next()
        } catch (error) {
            res.status(500).send({ message: "Something went wrong. Please try again later.", details: error.message })
        }
    }
}