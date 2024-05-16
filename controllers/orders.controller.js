const express = require('express');
const router = express.Router();
const Order = require('../models/orders.model');
const { compareHash } = require("./bcrypt");
const { SignToken, verifyUser } = require("./jwt");
const ORDER_STATUS = Order.ORDER_STATUS;

exports.findAll = async (req, res) => {
    try {
        // Check for authorization token
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "No access token provided" });
        }

        // Verify the user
        await verifyUser(req, res);

        // Get all orders
        const orders = await Order.findAll();
        res.send(orders);
    } catch (err) {
        res.status(500).send({
            message: err.message || "Something went wrong while getting list of orders."
        });
    }
};

exports.findOne = async (req, res) => {
    try {
        // Check for authorization token
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "No access token provided" });
        }

        // Verify the user
        await verifyUser(req, res);

        // Get the order
        const order = await Order.findByPk(req.params.id);
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
};

exports.updateStatus = async (req, res) => {
    try {
        // Check for authorization token
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "No access token provided" });
        }

        // Verify the user
        await verifyUser(req, res);

        // Check if the order status is valid
        if (!req.body.status || !Object.values(ORDER_STATUS).includes(req.body.status)) {
            return res.status(400).send({
                message: "Invalid order status"
            });
        }

        // Update the order status
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
};
module.exports = router;