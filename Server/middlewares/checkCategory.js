const { Category } = require('../models/index')

module.exports= {
    checkCategory: async(req, res, next) => {
        try {
            const categoryID = req.params.categoryID
            const category = await Category.findByPk(categoryID)
            if (!category) {
                return res.status(404).send({ message: "Category Not Found." })
            }
            res.locals.category= category
            next()
        } catch (error) {
            res.status(500).send({ message: "Something went wrong. Please try again later.", details: error.message })
        }
    }
}