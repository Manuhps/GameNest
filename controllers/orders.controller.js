const express = require('express');
const router = express.Router();
const Order = require('../models/orders.model');
const ORDER_STATUS = Order.ORDER_STATUS;

exports.findAll = (req, res) => {
    Order.findAll()
        .then(orders => {
            res.send(orders);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Something went wrong while getting list of orders."
            });
        });
}

exports.findOne = (req, res) => {
    Order.findByPk(req.params.id)
        .then(order => {
            if (!order) {
                return res.status(404).send({
                    message: "Order not found with id " + req.params.id
                });
            }
            res.send(order);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Order not found with id " + req.params.id
                });
            }
            return res.status(500).send({
                message: "Something went wrong getting order with id " + req.params.id
            });
        });
};

exports.updateStatus = (req, res) => {
    if (!req.body.status || !Object.values(ORDER_STATUS).includes(req.body.status)) {
        return res.status(400).send({
            message: "Invalid order status"
        });
    }

    Order.update({ state: req.body.status }, { where: { orderID: req.params.id } })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Order status was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Order with id=${req.params.id}. Maybe Order was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Order with id=" + req.params.id
            });
        });
};

module.exports = router;