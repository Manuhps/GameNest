const express = require('express');
const router = express.Router();
const { Order, OrderProduct, Product } = require("../models/index");
const { paginate, generatePaginationPath } = require("../utilities/pagination")

const validStates = ['empty', 'cart', 'pending', 'shipping', 'delivered'];

module.exports = {
    getAllOrders: async (req, res) => {
        try {
            const ordersData = await paginate(Order, { 
                include: [{ model: OrderProduct }]
            });

            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res);

            const links = [
                { rel: "createOrder", href: "/orders", method: "POST" },
                { rel: "getCurrent", href: "/orders/current", method: "GET" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];
    
            if (ordersData.data.length === 0) {
                return res.status(404).send({ message: "No orders found." });
            }
    
            res.status(200).send({
                pagination: ordersData.pagination,
                data: ordersData.data,
                links: links
            });
            } catch (err) {
                res.status(500).send({
                    message: err.message || "Something went wrong. Please try again later."
                });
            }   
        },

    getOrdersMe: async (req, res) => {
        try {

        const userID = res.locals.userID;

        const ordersData = await paginate(Order, {
            where: { userID: userID },  
            include: [{ model: OrderProduct }]
        });

        let nextPage, prevPage = await generatePaginationPath(req, res);

        const links = [
            { rel: "createOrder", href: "/orders", method: "POST" },
            { rel: "getCurrent", href: "/orders/current", method: "GET" },
            { rel: "nextPage", href: nextPage, method: "GET" },
            { rel: "prevPage", href: prevPage, method: "GET" }
        ];

        if (ordersData.data.length === 0) {
            return res.status(404).send({ message: "No orders found." });
        }

        res.status(200).send({
            pagination: ordersData.pagination,
            data: ordersData.data,
            links: links
        });
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
            const { state } = req.body;
    
            if (!req.body.state || !req.body.products || !Array.isArray(req.body.products) || req.body.products.length === 0) {
                return res.status(400).send({
                    message: "Please fill all the required fields and provide at least one product."
                });
            }
    
            // Validação do estado fornecido
            if (!validStates.includes(req.body.state)) {
                return res.status(400).send({ message: "Invalid state provided." });
            }
    
            if (req.body.state === 'cart') {
                const existingCartOrder = await Order.findOne({
                    where: {
                        userID: userID,
                        state: 'cart'
                    }
                });
                if (existingCartOrder) {
                    return res.status(400).send({ message: "There is already an existing order with state 'cart' for this user." });
                }
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
                if (['pending', 'shipping', 'delivered'].includes(state)) {
                    productExists.stock -= product.quantity;
                    await productExists.save();
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
                quantity: product.quantity,
                salePrice: product.salePrice
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
        
            //Checks if the dates are before the current date
            const currentDate= new Date().setHours(0,0,0,0)

            if (new Date(deliverDate) < currentDate) {
                return res.status(400).send({ message: "Deliver Date can't be before the current day" })
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

            if (['pending', 'shipping', 'delivered'].includes(state)) {
                const currentOrder = await Order.findOne({ where: { userID, state: 'cart' } });
                if (currentOrder) {
                    const orderProducts = await OrderProduct.findAll({ where: { orderID: currentOrder.orderID } });
                    for (const orderProduct of orderProducts) {
                        const product = await Product.findByPk(orderProduct.productID);
                        if (product) {
                            product.stock -= orderProduct.quantity;
                            await product.save();
                        }
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
        if (products && Array.isArray(products)) {
            for (const product of products) {
                const orderProduct = await OrderProduct.findOne({
                    where: {
                        orderID: order.orderID,
                        productID: product.productID
                    }
                });

                if (orderProduct) {
                    // If the product already exists in the order, return an error message
                    return res.status(400).send({ message: `Product with ID ${product.productID} is already in the cart.` });
                } else {
                    // Add new product to the order
                    await OrderProduct.create({
                        orderID: order.orderID,
                        productID: product.productID,
                        quantity: product.quantity,
                        salePrice: product.salePrice
                    });
                }
            }
        }
        res.status(200).send({ message: "Order updated successfully." });
    
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later.",
                details: error,
            });
        }
    },

    updateProductQuantity: async (req, res) => {
        try {
            const userID = res.locals.userID;
            const productID = parseInt(req.params.productID, 10);
            const { action } = req.body;

            if (!productID || !['increment', 'decrement'].includes(action)) {
                return res.status(400).send({ message: "Please insert valid values" });
            }

            const currentOrder = await Order.findOne({
                where: { userID: userID, state: 'cart' },
                include: [
                    {
                        model: OrderProduct,
                        where: { productID: productID }
                    }
                ]
            });

            if (!currentOrder) {
                return res.status(404).send({ message: "Product Not Found" });
            }

            const orderProduct = currentOrder.OrderProducts[0];

            if (action === 'increment') {
                const product = await Product.findByPk(productID);
                if (orderProduct.quantity + 1 > product.stock) {
                    return res.status(400).send({ message: "Not enough stock available" });
                }
                orderProduct.quantity += 1;
            } else if (action === 'decrement') {
                orderProduct.quantity -= 1;
                if (orderProduct.quantity <= 0) {
                    await orderProduct.destroy();
                } else {
                    await orderProduct.save();
                }
            }

            await orderProduct.save();
            return res.status(200).send({ message: "Data successfully updated" });
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later.",
                details: error,
            });
        }
    },

    deleteOrderProduct: async (req, res) => {
        try {
            const userID = res.locals.userID;
            const productID = parseInt(req.params.productID, 10);

            // Find the current order in the cart state for the user
            const currentOrder = await Order.findOne({
                where: { userID: userID, state: 'cart' },
                include: [
                    {
                        model: OrderProduct,
                        where: { productID: productID }
                    }
                ]
            });

            if (!currentOrder) {
                return res.status(404).send({ message: "Product not found in current order" });
            }

            const orderProduct = currentOrder.OrderProducts[0];

            // Delete the product from the order
            await orderProduct.destroy();

            return res.status(200).send({ message: "Product removed from current order successfully" });
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later.",
                details: error.message,
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