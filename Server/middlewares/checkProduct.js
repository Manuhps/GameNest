const { Product } = require('../models/index')

module.exports = {
    checkProduct: async(req, res, next) => {
        try {
            const productID = req.params.productID
            const product = await Product.findByPk(productID)
            if (!product) {
                res.status(404).send({ message: "Product Not Found" })
            }
            res.locals.product = product
            next()
        } catch (error) {
            res.status(500).send({ message: "Something went wrong. Please try again later.", details: error.message })
        }
    }
}