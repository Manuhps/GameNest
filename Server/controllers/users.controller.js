const { User } = require("../models/index");
const { compareHash } = require("../middlewares/bcrypt");
const { SignToken } = require("../middlewares/jwt");
const { paginate, generatePaginationPath } = require("../middlewares/pagination")

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
                res.status(403).send({ message: "You are currently banned. You can not access this feature…" })
            }
            if (req.body.password && req.body.username) {
                //Verifies if the password matches the user's password'
                const passwordIsValid = await compareHash(user.password, req.body.password);
                if (passwordIsValid) {
                    //Calls the SignToken function that creates the token
                    const token = await SignToken(user.userID);
                    res.status(201).send({ accessToken: token });
                } else {
                    res.status(401).send({ message: "Invalid Credentials" });
                }
            } else {
                res.status(400).send({ message: "Please fill all the required fields.", });
            }
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            });
        }
    },
    register: async (req, res) => {
        try {
            if (req.body.password && req.body.username && req.body.email) {
                if (await User.findOne({ where: { email: req.body.email } })) {
                    return res.status(409).send({ message: "User already exists" });
                } else {
                    const user = await User.create({
                        username: req.body.username,
                        email: req.body.email,
                        password: req.body.password,
                    });
                    const token = await SignToken(user.userID);
                    res.status(201).send({ message: "Registered Successfuly", token: token })
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
    getUsers: async (req, res) => {
        try {
            // Construct HATEOAS links
            const links = [
                { rel: "login", href: "/users/login", method: "POST" },
                { rel: "register", href: "/users", method: "POST" },
                { rel: "editProfile", href: "/users/me", method: "PATCH" },
                { rel: "banUser", href: "/users/:userID", method: "PATCH" }
            ]
            const users = await paginate(User, {
                attributes: {
                    exclude: ["password"],
                },
                offset: req.query.offset,
                limit: req.query.limit
            })
            if (users) {
                return res.status(200).send({users, links})
            }

        }catch(error) {
            return res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error
            })
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
                res.status(404).send({ message: "User Not Found" });
            }
            // Update the user's data with the values from the request body, if provided
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;
            if (req.body.email) user.email = req.body.email;
            if (req.body.address) user.address = req.body.address;
            if (req.body.postalCode) user.postalCode = req.body.postalCode;
            if (req.body.profileImg) user.profileImg = req.body.profileImg;

            // Save the changes to the database
            await user.save();

            // Return a success response
            res.status(200).send({ message: "Data successfully updated" });
        } catch (error) {
            if (error.name === "JsonWebTokenError") {
                res.status(401).send({ message: "Your token has expired! Please login again." });
            }
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            });
        }
    },
    getSelf: async (req, res) => {
        try {
            // Get the user ID from res.locals set by verifyUser middleware
            const userID = res.locals.userID;

            // Find the user by ID
            const user = await User.findByPk(userID);

            // If user is not found, return error
            if (!user) {
                res.status(404).send({ message: "User Not Found" });
            }

            // Construct links for other related actions
            const links = [
                { rel: "login", href: "/users/login", method: "POST" },
                { rel: "register", href: "/users", method: "POST" }
            ];

            // Return the user's information
            res.status(200).send({ user: user, links: links });
        } catch (error) {
            // Handle errors
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error,
            });
        }
    },
    banUser: async (req, res) => {
        try {
            //Get the user to be banned using it's id provided in the url
            const userID = req.params.userID
            const user = await User.findByPk(userID)

            if (!user) {
                return res.status(404).send({ message: "User Not Found" })
            }
            const isBanned = req.body.isBanned

            //Set the user as banned or Unbanned
            user.isBanned = isBanned

            //Save the data
            await user.save()

            //Returns a success message
            res.status(200).send({ message: "Data Successfully Updated" })
        } catch (error) {
            res.status(500).send({
                message: "Something went wrong. Please try again later",
                details: error
            })
        }
    }
};