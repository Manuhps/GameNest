const { Product, Order, Review, OrderProduct, Discount, Genre, GameMode, SubCategory, Category, User } = require("../models/index");
const { handleServerError, handleConflictError, handleSequelizeValidationError, handleJsonWebTokenError, handleBadRequest, handleForbiddenRequest, handleNotFoundError } = require("../utilities/errors");
const { getProductLinks } = require("../utilities/hateoas");
const { paginate, generatePaginationPath } = require('../utilities/pagination')
const { Op } = require('sequelize')
const sequelize = require('sequelize')

module.exports = {
    getProducts: async (req, res) => {
        try {
            const { curPrice, rating, categoryID, subCategoryID, name, date, genreID, gameModeID } = req.query
            const currentDate = new Date().setHours(0, 0, 0, 0)
            let where = {}
            let order = []
            let include = []
            let attributes = ['productID', 'name', 'basePrice', 'stock', 'rating', 'img']
            //Filter by category
            if (categoryID) {
                const category = Category.findByPk(categoryID)
                if (!category) {
                    handleNotFoundError(res, "Category Not Found")
                }
                where.categoryID = categoryID
            }
            //Filter by subCategory
            if (categoryID && subCategoryID) {
                const category = Category.findByPk(categoryID)
                if (!category) {
                    handleNotFoundError(res, "Category Not Found")
                }
                const subCategory = SubCategory.findByPk(subCategoryID)
                if (!subCategory) {
                    handleNotFoundError(res, "SubCategory Not Found")
                }
                const subCategoryBelong = await SubCategory.findOne({
                    where: {
                        subCategoryID: subCategoryID,
                        categoryID: categoryID
                    }
                })
                if (!subCategoryBelong) {
                    handleBadRequest(res, "SubCategory Does Not Belong to the Specified Category")
                }
                where.subCategoryID = subCategoryID
            }
            //Filter/Search by name
            if (name) {
                where.name = { [Op.like]: `%${name}%` } //Accepts not only the exact name but also similar names
            }                                           //that contain the name string
            //Filter by genre
            if (genreID) {
                const genre = Genre.findByPk(genreID)
                if (!genre) {
                    handleNotFoundError(res, "Genre Not Found")
                }
                include.push({
                    model: Genre,
                    attributes: ['genreName'],
                    through: { attributes: [] },
                    where: {
                        genreID: genreID
                    }
                })
            }
            //Filter by gameMode
            if (gameModeID) {
                const gameMode = GameMode.findByPk(gameModeID)
                if (!gameMode) {
                    handleNotFoundError(res, "GameMode Not Found")
                }
                include.push({
                    model: GameMode,
                    attributes: ['gameModeName'],
                    through: { attributes: [] },
                    where: {
                        gameModeID: gameModeID
                    }
                })
            }
            include.push(
                {
                    model: Discount,
                    attributes: ['percentage', 'startDate', 'endDate'],
                    where: {
                        startDate: { [Op.lte]: currentDate },
                        endDate: { [Op.gte]: currentDate }
                    },
                    required: false
                }
            )
            attributes.push([
                sequelize.literal('round(Product.basePrice * (1 - (coalesce(Discounts.percentage, 0) / 100)), 2)'), 'curPrice'
            ])
            //Order by curPrice 
            if (curPrice) {
                if (curPrice === 'higher') {
                    order.push([sequelize.literal('curPrice'), 'ASC'])
                } else if (curPrice === 'lower') {
                    order.push([sequelize.literal('curPrice'), 'DESC'])
                }
            }
            //Order by rating
            if (rating) {
                if (rating === 'higher') {
                    order.push(['rating', 'ASC']);
                } else if (rating === 'lower') {
                    order.push(['rating', 'DESC']);
                }
            }
            //Order by date created
            if (date) {
                if (date === 'higher') {
                    order.push(['createdAt', 'DESC'])
                } else if (date === 'lower') {
                    order.push(['createdAt', 'ASC'])
                }
            }
            // Construct links for pagination
            // let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage
            // const nextPageLink = { rel: "nextPage", href: nextPage, method: "GET" }
            // const prevPageLink = { rel: "prevPage", href: prevPage, method: "GET" }
            //Construct HATEOAS links
            const links = await getProductLinks(req, "getProducts", res)
            // links.push(nextPageLink, prevPageLink)
            //Uses paginate function to get results 
            const productsData = await paginate(Product, { order, where, include, attributes })
            if (productsData) {
                return res.status(200).send({
                    pagination: productsData.pagination,
                    data: productsData.data,
                    links: links
                })
            }
        } catch (error) {
            handleServerError(error, res)
        }
    },
    getProduct: async (req, res) => {
        try {
            const productID = req.params.productID;
            const currentDate = new Date().setHours(0, 0, 0, 0);

            const product = await Product.findByPk(productID, {
                attributes: [
                    'productID', 'name', 'desc', 'basePrice', 'stock', 'rating', 'img',
                    [sequelize.literal('round(Product.basePrice * (1 - (coalesce(Discounts.percentage, 0) / 100)), 2)'), 'curPrice']
                ],
                include: [{
                    model: Discount,
                    attributes: ['percentage', 'startDate', 'endDate'],
                    where: {
                        startDate: { [Op.lte]: currentDate },
                        endDate: { [Op.gte]: currentDate }
                    },
                    required: false
                }]
            });

            if (!product) {
                return handleNotFoundError(res, "Product Not Found");
            }
            const links = await getProductLinks(req, "getProduct", res)
            //Return the product
            return res.status(200).send(
                {
                    product: product,
                    links: links
                }
            )
        } catch (error) {
            handleServerError(error, res)
        }
    },
    addProduct: async (req, res) => {
        try {
            if (req.body.name && req.body.desc && req.body.basePrice && req.body.stock && req.body.categoryID) {
                if (await Product.findOne({ where: { name: req.body.name } })) {
                    handleConflictError(res, "This product already exists. Please add a different product.")
                } else {
                    const product = await Product.create({
                        name: req.body.name,
                        desc: req.body.desc,
                        basePrice: req.body.basePrice,
                        stock: req.body.stock,
                        img: req.body.img || null,
                        platform: req.body.platform || null,   //If the parameter is not sent in the body it's value is set to null or [] by default
                        categoryID: req.body.categoryID,
                        subCategoryID: req.body.subCategoryID || null
                    })
                    //Adds genres to intermediate table
                    if (req.body.genres && req.body.genres.length > 0) {
                        const genres = await Genre.findAll(
                            {
                                where: {
                                    genreID: {
                                        [Op.in]: req.body.genres
                                    }
                                }
                            }
                        )
                        await product.addGenres(genres);
                    }
                    //Adds gameModes to intermediate table
                    if (req.body.gameModes && req.body.gameModes.length > 0) {
                        const gameModes = await GameMode.findAll(
                            {
                                where: {
                                    gameModeID: {
                                        [Op.in]: req.body.gameModes
                                    }
                                }
                            }
                        );
                        await product.addGameModes(gameModes);
                    }
                    return res.status(201).send({ message: "New Product Added With Success." })
                }
            } else {
                handleBadRequest(res, "Please fill all the required fields")
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // Capture Sequelize Validation Errors
                handleSequelizeValidationError(error, res)
            } else if (error.name === "JsonWebTokenError") {
                handleJsonWebTokenError(res)
            }
            handleServerError(error, res)
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const product = res.locals.product
            //Destroys the Product if it exists
            await Product.destroy({ where: { productID: product.productID } })
            return res.status(204).send({ message: "Product deleted successfully." })
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                handleJsonWebTokenError(res)
            }
            handleServerError(error, res)
        }
    },
    addReview: async (req, res) => {
        try {
            const productID = req.params.productID
            const userID = res.locals.userID
            if (!req.body.rating) {
                handleBadRequest(res, "Please select a rating")
            }
            //Verify if the order's state is delievered
            const order = await OrderProduct.findAll({
                where: { productID: productID },
                include: [
                    {
                        model: Order,
                        where: { userID: userID, state: 'delivered' }
                    }
                ]
            })
            if (!order) {
                handleForbiddenRequest(res, "You can only review a product after you've received it.")
            }
            // Verify if the user has already reviewed this product
            const existingReview = await Review.findOne({
                where: { userID: userID, productID: productID }
            });

            if (existingReview) {
                handleForbiddenRequest(res, "You have already reviewed this product.")
            }
            //Adding the review after everything is validated
            await Review.create({
                userID: userID,
                productID: productID,
                rating: req.body.rating,
                comment: req.body.comment || null
            })
            return res.status(201).send({ message: "Review added successfully. Thank you for taking your time to review the product!" })
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                handleJsonWebTokenError(res)
            } else if (error.name === 'SequelizeValidationError') {
                // Capture Sequelize Validation Errors
                handleSequelizeValidationError(error, res)
            }
            handleServerError(error, res)
        }
    },
    getReviews: async (req, res) => {
        try {
            const productID = req.params.productID
            const where = { productID: productID }
            const attributes = ['rating', 'comment', 'reviewID']
            const include = {
                model: User,
                attributes: ['username', 'profileImg']
            }
            //Uses paginate function to get results 
            const reviewsData = await paginate(Review, { where, include, attributes })
            if (reviewsData) {
                return res.status(200).send({
                    pagination: reviewsData.pagination,
                    data: reviewsData.data,
                })
            }
        } catch (error) {
            handleServerError(error, res)
        }
    },
    addDiscount: async (req, res) => {
        try {
            const productID = req.params.productID
            const { startDate, endDate, percentage } = req.body
            await Discount.create({
                productID: productID,
                startDate: startDate,
                endDate: endDate,
                percentage: percentage
            })
            return res.status(201).send({ message: "New Discount Added With Success" })
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                handleJsonWebTokenError(res)
            } else if (error.name === 'SequelizeValidationError') {
                // Capture Sequelize Validation Errors
                handleSequelizeValidationError(error, res)
            }
            handleServerError(error, res)
        }
    },
    getDiscounts: async (req, res) => {
        try {
            const productID = req.params.productID
            const where = { productID: productID }
            const attributes = ['discountID', 'percentage', 'startDate', 'endDate', 'productID']
            //Uses paginate function to get results 
            const discountsData = await paginate(Discount, { where, attributes })
            if (discountsData) {
                return res.status(200).send({
                    pagination: discountsData.pagination,
                    data: discountsData.data
                })
            }
        } catch (error) {
            handleServerError(error, res)
        }
    },
    deleteDiscount: async (req, res) => {
        try {
            const productID = req.params.productID
            const discountID = req.params.discountID
            await Discount.destroy({ where: { discountID: discountID, productID: productID } })
            return res.status(204).send({ message: "Discount deleted successfully" })
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                handleJsonWebTokenError(res)
            }
            handleServerError(error, res)
        }
    },
    deleteComment: async (req, res) => {
        try {
            const { reviewID } = req.params
            const review = await Review.findByPk(reviewID)
            review.comment = null
            await review.save()

            return res.status(204).send({ message: "Comment deleted successfully" })
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                handleJsonWebTokenError(res)
            }
            handleServerError(error, res)
        }
    },
    editProduct: async (req, res) => {
        try {
            // Get the productID ID from url
            const productID = req.params.productID;
            // Find the product by ID
            const product = await Product.findByPk(productID);
            // Update the product's data with the values from the request body, if provided
            if (req.body.name) product.name = req.body.name;
            if (req.body.desc) product.desc = req.body.desc;
            if (req.body.basePrice) product.basePrice = req.body.basePrice;
            if (req.body.stock) product.stock = req.body.stock;
            if (req.body.img) product.img = req.body.img;
            if (req.body.platform) product.platform = req.body.platform;
            // Save the changes to the database
            await product.save();
            // Return a success response
            return res.status(200).send({ message: "Data successfully updated" });
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                handleJsonWebTokenError(res)
            } else if (error.name === 'SequelizeValidationError') {
                // Capture Sequelize Validation Errors
                handleSequelizeValidationError(error, res)
            }
            handleServerError(error, res)
        }
    }
}