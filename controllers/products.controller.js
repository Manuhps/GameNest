const { Product } = require("../models/index");
const { verifyAdmin } = require("../middlewares/jwt");
const { checkToken } = require("../middlewares/checkToken")
const { paginatedResults, generatePaginationPath } = require("../middlewares/pagination")

module.exports = {
    getProducts: async (req, res) => {
        try {
            // Pagination
            const products = await paginatedResults(req, res, 12, Product) //Sends the parameters req, res, limit(per page) and Model and returns the paginated list of products

            // Construct links for pagination
            // let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage

            // Construct HATEOAS links
            // const links = [
            //     { rel: "login", href: "/products/login", method: "POST" },
            //     { rel: "register", href: "/products", method: "POST" },
            //     { rel: "editProfile", href: "/products/me", method: "PATCH" },
            //     { rel: "banproduct", href: "/products/:productID", method: "PATCH" },
            //     { rel: "nextPage", href: nextPage, method: "GET" },
            //     { rel: "prevPage", href: prevPage, method: "GET" }
            // ];

            // Return the list of products
            res.status(200).send({ products: products });
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            });
        }
    },
    getProduct: async (req, res) => {
        try {
            //Get the product from it's id
            const product = res.locals.product

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
            if (req.body.name && req.body.desc && req.body.basePrice && req.body.stock && req.body.category) {
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
                        category: req.body.category
                    });
                    res.status(201).send({ message: "New Product Added With Success." })
                }
            } else {
                res.status(400).send({ messsage: "Please fill all the required fields" });
            }
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Plese try again later",
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
                message: "Something went wrong. Plese try again later",
                details: error,
            });
        }
    },
    // addReview: async (req, res) => {

    // }
}