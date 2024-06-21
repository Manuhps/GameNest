const { SubCategory } = require('../models/index')

module.exports = {
    checkSubCategoryExists: async (req, res, next) => {
        try {
            const subCategoryName = req.body.subCategoryName
            const subCategory = await SubCategory.findOne({ where: { subCategoryName: subCategoryName } })
            if (subCategory) {
                return res.status(409).send({ message: "SubCategory with that name already exists." })
            }
            next()
        } catch (error) {
            return res.status(500).send({ message: "Something went wrong. Please try again later.", details: error.message })
        }
    },
    checkSubCategory: async (req, res, next) => {
        try {
            const subCategoryID = req.params.subCategoryID
            const categoryID= req.params.categoryID
            const subCategory = await SubCategory.findOne({
                where:
                    {
                        subCategoryID: subCategoryID,
                        categoryID: categoryID
                    }
            })
            if (!subCategory) {
                return res.status(404).send({ message: "SubCategory Not Found." })
            }
            res.locals.subCategory = subCategory
            next()
        } catch (error) {
           return res.status(500).send({ message: "Something went wrong. Please try again later.", details: error.message })
        }
    }
}