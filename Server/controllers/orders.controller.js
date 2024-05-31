const express = require('express');
const router = express.Router();
const Order = require('../models/order.model'); 
const { generatePaginationPath } = require("../middlewares/pagination")

module.exports = {
    getOrders: async (req, res) => {
        try {

            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage

            const links = [
                { rel: "createOrder", href: "/orders", method: "POST" },
                { rel: "getCurrent", href: "/orders/current", method: "GET" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];

            console.log('success');
            res.status(200).send({orders: orders, links: links});
        } catch (err) {
            res.status(500).send({
                message: err.message || "Something went wrong. Please try again later."
            });
        }   
    },

    getCurrentOrder: async (req, res) => {
        try {

            const userID = res.locals.userID;
            console.log(userID)

            const links = [
                { rel: "createOrder", href: "/orders", method: "POST" },
                { rel: "getOrders", href: "/orders", method: "GET" },
            ];

            const currentOrder = await Order.findOne({
                where: {
                    userID: userID,
                    state: 'cart' 
                }
            });

            if (!currentOrder) {
                return res.status(404).send({ message: "No current order found" });
            }

            res.status(200).send({ currentOrder: currentOrder, links: links });
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error.message,
            });
        }
    },

    getOrder: async (req, res) => {
        try {
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
            const userID = res.locals.userID;
            console.log(userID); 

            if (!req.body.state) {
                return res.status(400).send({
                    message: "Please fill all the required fields"
                });
            } else {
                await Order.create({
                    state: req.body.state,
                    userID: userID
                });
                res.status(201).send({ message: "Order placed with success." });
            }
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            });
        }
    },

    
    updateOrder: async (req, res) => {
        try {
            const userID = res.locals.userID;
            
            const order = await Order.findOne({ where: { userID, state: 'cart' } });

            if (!order) {
                return res.status(404).send({ message: "Current order not found." });
            }

            const { state, deliverDate, cardName, cardNumber, cardExpiryDate } = req.body;

            order.state = state || order.state;
            order.deliverDate = deliverDate || order.deliverDate;
            order.cardName = cardName || order.cardName;
            order.cardNumber = cardNumber || order.cardNumber;
            order.cardExpiryDate = cardExpiryDate || order.cardExpiryDate;

            await order.save();

            res.status(200).send({ message: "Order updated successfully." });
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later.",
                details: error,
            });
        }
    },
    
    // Função delete apenas para ajudar nos testes de post de orders e não ficar demasiadas linhas na tabela na base de dados

    deleteOrder: async (req, res) => {
        try {
            
            let result = await Order.destroy({ where: { orderID: req.params.orderID}})
            if (result == 1)
                return res.status(201).send({
                    message: `Order deleted successfully.`
             
                });
            else {
                res
                    .status(404)
                    .send({
                        messsage: "Order not found",
                    });
            }
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later.",
                details: error,
            });
        }
    },
    
};