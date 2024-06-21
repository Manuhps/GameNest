const { Order, OrderProduct, Product, User } = require("../models/index");
const { paginate, generatePaginationPath } = require("../utilities/pagination")
const { handleServerError, handleNotFoundError, handleBadRequest, handleConflictError } = require("../utilities/errors")


module.exports = {
    getAllOrders: async (req, res) => {
        try {
            const ordersData = await paginate(Order, {
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: OrderProduct,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'orderID'] }
                }
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
                handleNotFoundError(res, "No orders found.")
            }

            return res.status(200).send({
                pagination: ordersData.pagination,
                data: ordersData.data,
                links: links
            });
        } catch (error) {
            handleServerError(error, res)
        }
    },

    getOrdersMe: async (req, res) => {
        try {
            const userID = res.locals.userID;
            const ordersData = await paginate(Order, {
                where: { userID: userID },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: OrderProduct,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'orderID'] }
                }
            });
            let nextPage, prevPage = await generatePaginationPath(req, res);
            const links = [
                { rel: "createOrder", href: "/orders", method: "POST" },
                { rel: "getCurrent", href: "/orders/current", method: "GET" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ];
            if (ordersData.data.length === 0) {
                handleNotFoundError(res, "No orders found")
            }

            return res.status(200).send({
                pagination: ordersData.pagination,
                data: ordersData.data,
                links: links
            });
        } catch (error) {
            handleServerError(error, res)
        }
    },

    getCurrentOrder: async (res) => {
        try {
            const userID = res.locals.userID;
            const links = [
                { rel: "updateOrder", href: "/orders/current", method: "PATCH" },
                { rel: "getOrdersMe", href: "/orders/me", method: "GET" },
            ];
            const currentOrder = await Order.findOne({
                where: {
                    userID: userID,
                    state: 'cart'
                },
                attributes: { exclude: ['deliverDate', 'cardName', 'cardNumber', 'cardExpiryDate', 'createdAt', 'updatedAt'] }
            });

            if (!currentOrder) {
                return res.status(404).send({ message: "No current order found" });
            }

            return res.status(200).send({ currentOrder: currentOrder, links: links });
        } catch (error) {
            handleServerError(error, res)
        }
    },

    createOrder: async (req, res) => {
        try {
            const userID = res.locals.userID;
            const { products } = req.body;

            if (!products || !Array.isArray(products) || products.length === 0) {
                handleBadRequest(res, "Please provide one product")
            }

            // Verifiy if all the products exist and the quantity
            for (const product of products) {
                const productExists = await Product.findByPk(product.productID);
                if (!productExists) {
                    handleNotFoundError(res, `Product with ID ${product.productID} does not exist.`)
                }
                if (isNaN(product.quantity) || product.quantity <= 0) {
                    handleBadRequest(res, "Invalid quantity provided.")
                }
                if (product.quantity > productExists.stock) {
                    handleBadRequest(res, `Quantity for product ${product.productID} exceeds available stock.`)
                }
            }

            //Verify if there is already an order in state cart for the user
            const existingCartOrder = await Order.findOne({
                where: {
                    userID: userID,
                    state: 'cart'
                }
            });
            if (existingCartOrder) {
                handleConflictError(res, "There is already an existing order with state 'cart' for this user.")
            }

            // Create the order with the state cart
            const order = await Order.create({
                state: 'cart',
                userID: userID
            });

            // Add products to the order
            const orderProducts = products.map(product => ({
                orderID: order.orderID,
                productID: product.productID,
                quantity: product.quantity,
                salePrice: product.salePrice
            }));

            await OrderProduct.bulkCreate(orderProducts);

            return res.status(201).send({ message: "Order placed successfully." });
        } catch (error) {
            console.error("Error creating order:", error);
            handleServerError(error, res)
        }
    },

    updateOrder: async (req, res) => {
        try {
            const userID = res.locals.userID;
            const { cardName, cardNumber, cardExpiryDate, products, pointsToUse, pointsEarned } = req.body;

            // Validate cardName
            if (cardName && typeof cardName !== 'string') {
                handleBadRequest(res, "Invalid cardName format. It must be a string.")
            }

            // Validate cardNumber
            if (cardNumber && isNaN(cardNumber)) {
                handleBadRequest(res, "Invalid cardNumber format. It must be an integer.")
            }

            // Validate cardExpiryDate
            if (cardExpiryDate && !/^(\d{4})-(\d{2})-(\d{2})$/.test(cardExpiryDate)) {
                handleBadRequest(res, "Invalid cardExpiryDate format. It must be a valid date.")
            }

            if (pointsToUse && (isNaN(pointsToUse) || pointsToUse < 0)) {
                handleBadRequest(res, "Invalid pointsToUse format. It must be a positive integer.")
            }

            // Validate products if provided
            if (products && Array.isArray(products)) {
                for (const product of products) {
                    const productExists = await Product.findByPk(product.productID);
                    if (!productExists) {
                        handleNotFoundError(res, `Product with ID ${product.productID} does not exist.`)
                    }
                    if (isNaN(product.quantity) || product.quantity <= 0) {
                        handleBadRequest(res, "Invalid quantity provided.")
                    }
                    if (product.quantity > productExists.stock) {
                        handleBadRequest(res, `Quantity for product ${product.productID} exceeds available stock.`)
                    }
                }
            }

            // Find the order
            const order = await Order.findOne({ where: { userID, state: 'cart' } });
            if (!order) {
                handleNotFoundError(res, "Current order not found.")
            }

            const user = await User.findByPk(userID);

            // Validate if user has enough points
            if (pointsToUse && pointsToUse > user.points) {
                handleBadRequest(res, "Not enough points available.")
            }

            let totalOrderValue = 0;
            const orderProducts = await OrderProduct.findAll({ where: { orderID: order.orderID } });
            for (const orderProduct of orderProducts) {
                totalOrderValue += orderProduct.salePrice * orderProduct.quantity;
            }

            let discount = 0;
            if (pointsToUse) {
                discount = pointsToUse / 2;

                // Validate if discount is greater than the totalOrderValue
                if (discount > totalOrderValue) {
                    handleBadRequest(res, "Discount cannot be greater than the total order value.")
                }

                if (!cardName && !cardNumber && !cardExpiryDate && pointsToUse && discount < totalOrderValue) {
                    handleBadRequest(res, "Points are not enough to cover the total order value.")
                }

                totalOrderValue -= discount;
                user.points -= pointsToUse;
            }


            // Update order attributes
            order.cardName = cardName || order.cardName;
            order.cardNumber = cardNumber || order.cardNumber;
            order.cardExpiryDate = cardExpiryDate || order.cardExpiryDate;

            if ((cardName && cardNumber && cardExpiryDate) || pointsToUse || (cardName && cardNumber && cardExpiryDate && pointsToUse)) {
                order.state = 'pending';
                const currentDate = new Date();
                const deliverDate = new Date(currentDate);
                deliverDate.setDate(deliverDate.getDate() + 14); // Add 14 days (2 weeks)
                order.deliverDate = deliverDate;

                await order.save();

                // Update product stock and user points
                for (const orderProduct of orderProducts) {
                    const product = await Product.findByPk(orderProduct.productID);
                    if (product) {
                        product.stock -= orderProduct.quantity;
                        await product.save();
                    }
                }

                // Update user points based on order total
                const pointsEarned = Math.floor(totalOrderValue / 2);
                user.points += pointsEarned;

                await user.save();

                // Schedule automatic state transitions
                setTimeout(async () => {
                    // Check if order is still in 'pending' state after 2 days
                    const updatedOrder = await Order.findByPk(order.orderID);
                    if (updatedOrder.state === 'pending') {
                        updatedOrder.state = 'shipping';
                        await updatedOrder.save();
                    }
                }, 2 * 24 * 60 * 60 * 1000); // 2 days in milliseconds

                setTimeout(async () => {
                    // Check if order is still in 'shipping' state on deliverDate
                    const updatedOrder = await Order.findByPk(order.orderID);
                    const currentDate = new Date();
                    if (updatedOrder.state === 'shipping' && currentDate >= deliverDate) {
                        updatedOrder.state = 'delivered';
                        await updatedOrder.save();
                    }
                }, deliverDate.getTime() - Date.now()); // Time until deliverDate in milliseconds
            }

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
                        handleConflictError(res, `Product with ID ${product.productID} is already in the cart.`)
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

            return res.status(200).send({
                message: "Order updated successfully.",
                totalValue: totalOrderValue,
                discount: discount,
                pointsUsed: pointsToUse || 0,
                pointsEarned: pointsEarned
            });

        } catch (error) {
            handleServerError(error, res)
        }
    },
    updateProductQuantity: async (req, res) => {
        try {
            const userID = res.locals.userID;
            const productID = parseInt(req.params.productID, 10);
            const { action } = req.body;

            if (!productID || !['increment', 'decrement'].includes(action)) {
                handleBadRequest(res, "Please insert valid values")
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
                handleNotFoundError(res, "Product Not Found")
            }

            const orderProduct = currentOrder.OrderProducts[0];

            if (action === 'increment') {
                const product = await Product.findByPk(productID);
                if (orderProduct.quantity + 1 > product.stock) {
                    handleBadRequest(res, "Not enough stock available")
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
            return res.status(200).send({ message: "Quantity successfully updated" });
        } catch (error) {
            handleServerError(error, res)
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
                handleNotFoundError(res, "Product not found in current order")
            }
            const orderProduct = currentOrder.OrderProducts[0];
            // Delete the product from the order
            await orderProduct.destroy();
            return res.status(200).send({ message: "Product removed from current order successfully" });
        } catch (error) {
            handleServerError(error, res)
        }
    },
    getOrderProducts: async (res) => {
        try {
            const userID = res.locals.userID
            const currentOrder = await Order.findOne({
                where: {
                    userID: userID,
                    state: 'cart'
                }
            });
            const attributes = ['orderID', 'productID', 'salePrice', 'quantity']
            const where = {orderID: currentOrder.orderID}
            const include = {
                model: Product,
                attributes: ['name', 'img'] 
            }
            const orderProductsData = await paginate(OrderProduct, { attributes, where, include })
            if (orderProductsData) {
                return res.status(200).send({
                    pagination: orderProductsData.pagination,
                    data: orderProductsData.data
                })
            }
        } catch (error) {
            handleServerError(error, res)
        }
    }
}