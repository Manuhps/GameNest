const { User, Order, OrderProduct, Review } = require("../models/index");
const { handleServerError } = require("../utilities/errors");
const { paginate } = require("../utilities/pagination")
const sequelize = require('sequelize')

module.exports = {
    getMostOrders: async (req, res) => {
        try {
            const usersMostOrders = await paginate(User, {
                attributes: ['username', [sequelize.fn('count', sequelize.literal('Orders.orderID')), 'totalOrders']],
                include: [
                    {
                        model: Order,
                        attributes: []
                    }
                ],
                order: [[sequelize.literal('totalOrders'), 'DESC']],
                group: ['username']
            })
            if (usersMostOrders) {
                return res.status(200).send({
                    pagination: usersMostOrders.pagination,
                    data: usersMostOrders.data
                })
            }
        } catch (error) {
            handleServerError(error, res)
        }
    },
    getMostSpent: async (req, res) => {
        try {
            const usersMostSpent= await paginate(User, {
                attributes: ['username', [sequelize.fn('sum', sequelize.literal('COALESCE(salePrice * quantity, 0)')), 'totalSpent']],
                include: [
                    {
                        model: Order,
                        attributes: [],
                        include: [{
                            model: OrderProduct,
                            attributes: [] 
                        }]
                    },
                ],
                order: [[sequelize.literal('totalSpent'), 'DESC']],
                group: ['username']
            })
            if (usersMostSpent) {
                return res.status(200).send({
                    pagination: usersMostSpent.pagination,
                    data: usersMostSpent.data
                })
            }
        } catch (error) {
            handleServerError(error, res)
        }
    },
    getMostReviews: async (req, res) => {
        try {
            const usersMostReviews = await paginate(User, {
                attributes: ['username', [sequelize.fn('count', sequelize.literal('Reviews.reviewID')), 'totalReviews']],
                include: [
                    {
                        model: Review,
                        attributes: []
                    }
                ],
                order: [[sequelize.literal('totalReviews'), 'DESC']],
                group: ['username']
            })
            if (usersMostReviews) {
                return res.status(200).send({
                    pagination: usersMostReviews.pagination,
                    data: usersMostReviews.data
                })
            }
        } catch (error) {
            handleServerError(error, res)
        }
    }
}