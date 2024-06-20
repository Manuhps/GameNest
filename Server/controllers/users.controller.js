const { User } = require("../models/index");
const { compareHash } = require("../utilities/bcrypt");
const { handleForbiddenRequest, handleInvalidRequest, handleBadRequest, handleServerError, handleSequelizeValidationError, handleConflictError, handleJsonWebTokenError, handleNotFoundError } = require("../utilities/errors");
const { SignToken } = require("../middlewares/jwt");
const { paginate, generatePaginationPath } = require("../utilities/pagination")

const cloudinary = require("cloudinary").v2;
require('dotenv').config();

// cloudinary configuration
cloudinary.config({
  cloud_name: process.env.C_CLOUD_NAME,
  api_key: process.env.C_API_KEY,
  api_secret: process.env.C_API_SECRET
});

const multer = require('multer');
const upload = multer({ dest: 'uploads/' });


module.exports = {
    login: async (req, res) => {
        // await User.create({
        //     username: 'admin',
        //     email: 'admin@example.com',
        //     password: 'Esmad',
        //     role: 'admin'
        // })
        try {
            const user = await User.findOne({ where: { username: req.body.username } });
            if (user.isBanned) {
                handleForbiddenRequest(res, "You are currently banned. You can not access this feature…")
            }
            if (req.body.password && req.body.username) {
                //Verifies if the password matches the user's password'
                const passwordIsValid = await compareHash(user.password, req.body.password);
                if (passwordIsValid) {
                    //Calls the SignToken function that creates the token
                    const token = await SignToken(user.userID);
                    return res.status(201).send({ accessToken: token });
                } else {
                    handleInvalidRequest(res, "Invalid Credentials")
                }
            } else {
                handleBadRequest(res, "Please fill all the required fields.")
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // Capture Sequelize Validation Errors
                handleSequelizeValidationError(error, res)
            }
            handleServerError(error, res)
        }
    },
    register: async (req, res) => {
        try {
            if (req.body.password && req.body.username && req.body.email) {
                if (await User.findOne({ where: { email: req.body.email } })) {
                    handleConflictError(res, "User already exists")
                } else {
                    let user_image = null;
                    let defaultImageUrl = 'https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png'; // Substitua pela URL da imagem padrão
                    let imagePath = req.file ? req.file.path : defaultImageUrl;
    
                    // upload image
                    if (req.file) {
                        user_image = await cloudinary.uploader.upload(imagePath);
                    } else {
                        user_image = { url: defaultImageUrl, public_id: null };
                    }
                    
                    const user = await User.create({
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                        profileImg: user_image.url, // save URL to access the image
                        cloudinary_id: user_image.public_id // save image ID to delete it
                    });
                    const token = await SignToken(user.userID);
                    return res.status(201).send({ message: "Registered Successfully", token: token })
                }
            } else {
                handleBadRequest(res, "Please fill all the required fields")
            }
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                handleSequelizeValidationError(error, res)
            }
            handleServerError(error, res)
        }
    },
    getUsers: async (req, res) => {
        try {
            const { role, isBanned } = req.query
            let where = {}
            //Filter by user role
            if (role) {
                where.role= role
            }
            //Filter by banned or unbanned user
            if (isBanned) {
                where.isBanned= isBanned
            }
            // Construct links for pagination
            let nextPage, prevPage = await generatePaginationPath(req, res,) //Generates the Url dinamically for the nextPage and previousPage
            // Construct HATEOAS links
            const links = [
                { rel: "login", href: "/users/login", method: "POST" },
                { rel: "register", href: "/users", method: "POST" },
                { rel: "editProfile", href: "/users/me", method: "PATCH" },
                { rel: "banUser", href: "/users/:userID", method: "PATCH" },
                { rel: "nextPage", href: nextPage, method: "GET" },
                { rel: "prevPage", href: prevPage, method: "GET" }
            ]
            const users = await paginate(User, {
                attributes: 
                    ['userID', 'username', 'email', 'role', 'isBanned']
                ,
                where,
                offset: req.query.offset,
                limit: req.query.limit
            })
            if (users) {
                return res.status(200).send({
                    pagination: users.pagination,
                    data: users.data,
                    links: links
                })
            }
        } catch (error) {
            handleServerError(error, res)
        }
    },
    editProfile: async (req, res) => {
        try {
            // Get the user ID from res.locals set by verifyUser middleware
            const userID = res.locals.userID;
            // Find the user by ID
            const user = await User.findByPk(userID);
            // If user is not found, return error
            if (!user) {
                handleNotFoundError(res, "User Not Found")
            }
            // Update the user's data with the values from the request body, if provided
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;
            if (req.body.email) user.email = req.body.email;
            if (req.body.address) user.address = req.body.address;
            if (req.body.postalCode) user.postalCode = req.body.postalCode;
            
            let user_image = null;
            if (req.file) {
                // Check if the user has an existing image
                if (user.cloudinary_id) {
                    // Delete image from cloudinary
                    await cloudinary.uploader.destroy(user.cloudinary_id);
                }
                // upload a new image image (using multer memory storage engine)
                user_image = await cloudinary.uploader.upload(req.file.path);
            }
            user.profileImg = user_image ? user_image.url : user.profileImg;
            user.cloudinary_id = user_image ? user_image.public_id : user.cloudinary_id;
    
            // Save the changes to the database
            await user.save();
            // Return a success response
            return res.status(200).send({ message: "Data successfully updated" });
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                handleJsonWebTokenError(error, res)
            }
            handleServerError(error, res)
        }
    },
    getSelf: async (req, res) => {
        try {
            // Get the user ID from res.locals set by verifyUser middleware
            const userID = res.locals.userID;
            // Find the user by ID
            const user = await User.findByPk(userID, {attributes: ['username', 'email', 'address', 'points', 'profileImg', 'role']});
            // If user is not found, return error
            if (!user) {
                handleNotFoundError(res, "User Not Found")
            }
            // Construct links for other related actions
            const links = [
                { rel: "login", href: "/users/login", method: "POST" },
                { rel: "register", href: "/users", method: "POST" }
            ];
            // Return the user's information
            return res.status(200).send({ user: user, links: links });
        } catch (error) {
            // Handle Server Error
            handleServerError(error, res)
        }
    },
    banUser: async (req, res) => {
        try {
            //Get the user to be banned using it's id provided in the url
            const userID = req.params.userID
            const user = await User.findByPk(userID)
            const isBanned = req.body.isBanned
            //Set the user as banned or Unbanned
            user.isBanned = isBanned
            //Save the data
            await user.save()
            //Returns a success message
            return res.status(200).send({ message: "Data Successfully Updated" })
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // Capture Sequelize Validation Errors
                handleSequelizeValidationError(error, res)
            }
            handleServerError(error, res)
        }
    }
}