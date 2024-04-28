const express = require('express');
const router = express.Router();
const orders = require('../models/orders.model');

exports.findAll = (req, res) => {
    orders.find()
        .then(orders => {
            res.send(orders);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Something went wrong while getting list of orders."
            });
        });
}

exports.findOne = (req, res) => {
    orders.findById(req.params.id)
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
 

module.exports = router;