const express = require('express');
const router = express.Router();
const { Order, OrderProduct, Product } = require("../models/index");
const { generatePaginationPath } = require("../middlewares/pagination")

const validStates = ['empty', 'cart', 'pending', 'shipping', 'delivered'];

module.exports = {
    getOrders: async (req, res) => {
        try {

            const userID = res.locals.userID;

            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage

            const links = [
                { rel: "createOrder", href: "/orders", method: "POST" },
                { rel: "getCurrent", href: "/orders/current", method: "GET" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];

            const { offset, limit } = req.query;
            let query = {
                where: {},
            }

            if (offset && limit) {
                query.offset = parseInt(offset)
                query.limit = parseInt(limit)
            }

            const orders = await Order.findAll({
                where: { userID: userID },
                include: [
                    {
                        model: OrderProduct
                    }
                ]
            });

            if (orders.length === 0) {
                return res.status(404).send({ message: "No orders found." });
            }

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
    
    createOrder: async (req, res) => {
        try {
            const userID = res.locals.userID;
    
            if (!req.body.state || !req.body.products || !Array.isArray(req.body.products) || req.body.products.length === 0) {
                return res.status(400).send({
                    message: "Please fill all the required fields and provide at least one product."
                });
            }
    
            // Validação do estado fornecido
            if (!validStates.includes(req.body.state)) {
                return res.status(400).send({ message: "Invalid state provided." });
            }
    
            // Verificar se todos os produtos existem
            const products = req.body.products;
            for (const product of products) {
                const productExists = await Product.findByPk(product.productID);
                if (!productExists) {
                    return res.status(400).send({ message: `Product with ID ${product.productID} does not exist.` });
                }
                if (isNaN(product.quantity) || product.quantity <= 0) {
                    return res.status(400).send({ message: "Invalid quantity provided." });
                }
                if (product.quantity > productExists.stock) {
                    return res.status(400).send({ message: `Quantity for product ${product.productID} exceeds available stock.` });
                }
                
            }
    
            // Cria a ordem
            const order = await Order.create({
                state: req.body.state,
                userID: userID
            });
    
            // Adiciona produtos à ordem
            const orderProducts = products.map(product => ({
                orderID: order.orderID,
                productID: product.productID,
                quantity: product.quantity
            }));
    
            await OrderProduct.bulkCreate(orderProducts);
    
            res.status(201).send({ message: "Order placed successfully." });
        } catch (error) {
            console.error("Error creating order:", error);
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            });
        }
    },

    
    updateOrder: async (req, res) => {
        try {
            const userID = res.locals.userID;
            const { state, deliverDate, cardName, cardNumber, cardExpiryDate, products } = req.body;
    
            // Validate state
            if (state && !validStates.includes(state)) {
                return res.status(400).send({ message: "Invalid state provided." });
            }
    
            // Validate deliverDate
            if (deliverDate && !/^(\d{4})-(\d{2})-(\d{2})$/.test(deliverDate)) {
                return res.status(400).send({ message: "Invalid deliverDate format. It must be a valid date." });
            }
    
            // Validate cardName
            if (cardName && typeof cardName !== 'string') {
                return res.status(400).send({ message: "Invalid cardName format. It must be a string." });
            }
    
            // Validate cardNumber
            if (cardNumber && isNaN(cardNumber)) {
                return res.status(400).send({ message: "Invalid cardNumber format. It must be an integer." });
            }
    
            // Validate cardExpiryDate
            if (cardExpiryDate && !/^(\d{4})-(\d{2})-(\d{2})$/.test(cardExpiryDate)) {
                return res.status(400).send({ message: "Invalid cardExpiryDate format. It must be a valid date." });
            }
    
            // Validate products if provided
            if (products && Array.isArray(products)) {
                for (const product of products) {
                    const productExists = await Product.findByPk(product.productID);
                    if (!productExists) {
                        return res.status(400).send({ message: `Product with ID ${product.productID} does not exist.` });
                    }
                    if (isNaN(product.quantity) || product.quantity <= 0) {
                        return res.status(400).send({ message: "Invalid quantity provided." });
                    }
                    if (product.quantity > productExists.stock) {
                        return res.status(400).send({ message: `Quantity for product ${product.productID} exceeds available stock.` });
                    }                    
                }
            }

            // Find the order
        const order = await Order.findOne({ where: { userID, state: 'cart' } });
        if (!order) {
            return res.status(404).send({ message: "Current order not found." });
        }

        // Update order attributes
        order.state = state || order.state;
        order.deliverDate = deliverDate || order.deliverDate;
        order.cardName = cardName || order.cardName;
        order.cardNumber = cardNumber || order.cardNumber;
        order.cardExpiryDate = cardExpiryDate || order.cardExpiryDate;

        // Save the updated order
        await order.save();
        res.status(200).send({ message: "Order updated successfully." });
    
            // Restante do código para atualizar a order
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