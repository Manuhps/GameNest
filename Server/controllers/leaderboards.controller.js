const { User, Order, OrderProduct } = require("../models/index");
const { paginate, generatePaginationPath } = require("../utilities/pagination")
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
            return res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            })
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
            console.log(error);
            return res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            })
        }
    }
}