const { Product } = require("../models/index");
const { compareHash } = require("../middlewares/bcrypt");
const { SignToken, verifyAdmin, verifyUser } = require("../middlewares/jwt");
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
            //     { rel: "register", href: "/users", method: "POST" },
            //     { rel: "editProfile", href: "/users/me", method: "PATCH" },
            //     { rel: "banUser", href: "/users/:userID", method: "PATCH" },
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
            //Getting the product's id
            const productId= req.params.productID

            //Get the product from it's id
            const product= await Product.findByPk(productId)

            //Returns not found if the product doesn't exist
            if (!product) {
                res.status(404).send({ message: "Product Not Found" })
            }

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
        
    }
}