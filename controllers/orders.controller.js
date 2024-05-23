const express = require('express');
const router = express.Router();
const Order = require('../models/order.model');
const ORDER_STATUS = Order.ORDER_STATUS;

module.exports = {
    getAllOrders: async (req, res) => {
        try {
            
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
            }
    
            await verifyUser(req, res);
    
            const orders = await Order.findAll();
            res.send(orders);
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong while getting list of orders."
            });
        }
    },
    getOrder: async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
            }
    
            await verifyUser(req, res);
    
            const order = await Order.findByPk(req.params.id, {
                include: [{
                    model: orderProduct,
                    as: 'orderProducts'
                }]
            });
    
            if (!order) {
                return res.status(404).send({
                    message: "Order not found with id " + req.params.id
                });
            }
            res.send(order);
        } catch (err) {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Order not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Something went wrong getting order with id " + req.params.id
            });
        }
    },
    
    createOrder: async (req, res) => {
        try {
            if (!req.body.cardName || !req.body.cardNumber || !req.body.cardExpiryDate || !req.body.state) {
                return res.status(400).send({
                    message: "Please fill all the required fields"
                });
            
            } else {
                await Order.create({
                    cardName: req.body.cardName,
                    cardNumber: req.body.cardNumber,
                    cardExpiryDate: req.body.cardExpiryDate,
                    state: req.body.state,
                });
                res.status(201).send({ message: "Order placed with success." })
            }
    
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            });
        }
    },
    updateOrderStatus: async (req, res) => {
        try {
            if (!req.headers.authorization) {
                return res.status(401).send({ message: "No access token provided" });
            }

            await verifyUser(req, res);

            if (!req.body.status || !Object.values(ORDER_STATUS).includes(req.body.status)) {
                return res.status(400).send({
                    message: "Invalid order status"
                });
            }

            const num = await Order.update({ state: req.body.status }, { where: { orderID: req.params.id } });
            if (num == 1) {
                res.send({
                    message: "Order status was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Order with id=${req.params.id}. Maybe Order was not found or req.body is empty!`
                });
            }
        } catch (err) {
            res.status(500).send({
                message: "Error updating Order with id=" + req.params.id
            });
        }
    }
};