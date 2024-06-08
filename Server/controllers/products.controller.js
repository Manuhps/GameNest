const { Product, Order, Review, OrderProduct, Discount, Genre, GameMode } = require("../models/index");
const { paginate } = require('../utilities/pagination')
const {Op} = require('sequelize')
const sequelize = require('sequelize')

module.exports = {
    getProducts: async (req, res) => {
        try {
            // // Construct links for pagination
            //   let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage

            //   //Construct HATEOAS links
            //   const links = [
            //       { rel: "login", href: "/products/login", method: "POST" },
            //       { rel: "register", href: "/products", method: "POST" },
            //       { rel: "editProfile", href: "/products/me", method: "PATCH" },
            //       { rel: "banproduct", href: "/products/:productID", method: "PATCH" },
            //       { rel: "nextPage", href: nextPage, method: "GET" },
            //       { rel: "prevPage", href: prevPage, method: "GET" }
            // ];

            const { curPrice, rating, categoryID, subCategoryID, name, date, genreID, gameModeID } = req.query
            const currentDate = new Date().setHours(0, 0, 0, 0)
            let where = {}
            let order = []
            let include = []
            let attributes = ['name', 'basePrice', 'stock', 'rating', 'img']
            //Filter by category
            if (categoryID) {
                where.categoryID=categoryID
            }
            //Filter by subCategory
            if (subCategoryID) {
                where.subCategoryID = subCategoryID
            }
            //Filter/Search by name
            if (name) {
                where.name = { [Op.like]: `%${name}%` } //Accepts not only the exact name but also similar names
            }                                           //that contain the name string
            //Filter by genre
            if (genreID) {
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
            //Uses paginate function to get results 
            const productsData = await paginate(Product, { order, where, include, attributes })

            if (productsData) {
                return res.status(200).send({
                    pagination: productsData.pagination,
                    data: productsData.data
                })
            }
        } catch (error) {
            console.log(error);
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            });
        }
    },
    getProduct: async (req, res) => {
        try {
            const productID = req.params.productID;
            const product = await Product.findByPk(productID);
            //Return the product
            res.status(200).send({ product: product })

        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            });
        }
    },
    addProduct: async (req, res) => {
        try {
            if (req.body.name && req.body.desc && req.body.basePrice && req.body.stock && req.body.categoryID) {
                if (await Product.findOne({ where: { name: req.body.name } })) {
                    return res.status(409).send({ message: "This product already exists. Please add a different product." });
                } else {
                    const product= await Product.create({
                        name: req.body.name,
                        desc: req.body.desc,
                        basePrice: req.body.basePrice,
                        stock: req.body.stock,
                        img: req.body.img || null,
                        platform: req.body.platform || null,   //If the parameter is not sent in the body it's value is set to null or [] by default
                        categoryID: req.body.categoryID,
                    });
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
                        );
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
                    res.status(201).send({ message: "New Product Added With Success." })
                }
            } else {
                res.status(400).send({ messsage: "Please fill all the required fields" });
            }
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            });
        }
    },
    deleteProduct: async (req, res) => {
        try {
            const product = res.locals.product

            //Destroys the Product if it exists
            await Product.destroy({ where: { productID: product.productID } })

            res.status(204).send({ message: "Product deleted successfully." })
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            })
        }
    },
    addReview: async (req, res) => {
        try {
            const productID = req.params.productID
            const userID = res.locals.userID

            if (!req.body.rating) {
                res.status(400).send({ message: "Please select a rating" })
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
                res.status(403).send({ message: "You can only review a product after you've received it." });
            }
            // Verify if the user has already reviewed this product
            const existingReview = await Review.findOne({
                where: { userID: userID, productID: productID }
            });

            if (existingReview) {
                return res.status(403).send({ message: "You have already reviewed this product." });
            }

            //Adding the review after everything is validated
            await Review.create({
                userID: userID,
                productID: productID,
                rating: req.body.rating,
                comment: req.body.comment || null
            });

            return res.status(201).send({ message: "Review added successfully. Thank you for taking your time to review the product!" })
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            });
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
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            })
        }
    },
    deleteDiscount: async (req, res) => {
        try {
            const productID = req.params.productID
            const discountID = req.params.discountID

            await Discount.destroy({ where: { discountID: discountID, productID: productID } })

            return res.status(204).send({ message: "Discount deleted successfully" })
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            })
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
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            })
        }
    }
}