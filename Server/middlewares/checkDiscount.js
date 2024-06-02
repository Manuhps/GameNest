const { Discount } = require('../models/index')
const { Op } = require('sequelize')

module.exports = {
    checkDiscount: async (req, res, next) => {
        try {
            const productID = req.params.productID
            const { startDate, endDate, percentage } = req.body

            //Check if all parameters are sent
            if (!startDate || !endDate || !productID || !percentage) {
                return res.status(400).send({ message: "Please fill all the required fields" })
            }

            //Checks if the Start Date is before the End Date
            if (new Date(startDate) > new Date(endDate)) {
                return res.status(400).send({ message: 'Invalid date range. Please check the start and end dates.' })
            }
            
            const currentDate= new Date().setHours(0,0,0,0)
            //Checks if the dates are before the current date
            if (new Date(startDate) < currentDate || new Date(endDate) < currentDate) {
                return res.status(400).send({ message: "Start and end dates can't be before the current day" })
            }

            //Verifies if there is an existing discount for the specific product with either the start or end date provided
            const existingDiscount = await Discount.findOne({
                where: {
                    productID: productID,
                    [Op.or]: [
                        {
                            startDate: {
                                [Op.between]: [new Date(startDate), new Date(endDate)]
                            }
                        },
                        {
                            endDate: {
                                [Op.between]: [new Date(startDate), new Date(endDate)]
                            }
                        }
                    ]
                }
            })
            if (existingDiscount) {
                return res.status(409).send({ message: "The product already has a discount within that date." })
            }
            next()
            
        } catch (error) {
            res.status(500).send({ message: "Something went wrong. Please try again later.", details: error.message });
        }
    }
}