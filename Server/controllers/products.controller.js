const { Product, Order, Review, OrderProduct, Discount } = require("../models/index");
const { paginate } = require('../middlewares/pagination')
const {Op} =  require('sequelize')

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

            const { price, rating, categoryID, subCategoryID, name} = req.query
            let where = {}
            let order = []

            if (categoryID) {
                where.categoryID = categoryID
            }
            if (subCategoryID) {
                where.subCategoryID = subCategoryID
            }
            if (name) {
                where.name = { [Op.like]: `%${name}%` } //Accepts not only the exact name but also similar names
            }                                            //that contain the name string  

            //Order by price
            if (price) {
                if (price === 'higher') {
                    order.push(['price', 'DESC'])
                } else if (price === 'lower') {
                    order.push(['price', 'ASC'])
                }
            }
            //Order by rating
            if (rating) {
                if (rating === 'higher') {
                    order.push(['rating', 'DESC']);
                } else if (rating === 'lower') {
                    order.push(['rating', 'ASC']);
                }
            }

            //Uses paginate function to get results 
            const productsData = await paginate(Product, { order, where })

            if (productsData) {
                return res.status(200).send({
                    pagination: productsData.pagination,
                    data: productsData.data
                })
            }

        } catch (error) {
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
                    res.status(409).send({ message: "This product already exists. Please add a different product." });
                } else {
                    await Product.create({
                        name: req.body.name,
                        desc: req.body.desc,
                        basePrice: req.body.basePrice,
                        stock: req.body.stock,
                        img: req.body.img || null,
                        platform: req.body.platform || null,   //If the parameter is not sent in the body it's value is set to null or [] by default
                        genres: req.body.genres || null,
                        gameModes: req.body.gameModes || null,
                        categoryID: req.body.categoryID
                    });
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

            await Discount.destroy({ where: { discountID: discountID, productID: productID} })
            
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