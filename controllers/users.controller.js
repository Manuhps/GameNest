const { User } = require("../models/index");
const { compareHash } = require("./bcrypt");
const { SignToken, verifyAdmin, verifyUser } = require("./jwt");

module.exports = {
  login: async (req, res) => {
    try {
      const user = await User.findOne({ where: { email: req.body.email } });
      if (req.body.password && req.body.email) {
        const passwordIsValid = await compareHash(
          user.password,
          req.body.password
        );

        if (passwordIsValid) {
          console.log("Valid Password yep");
          const token = await SignToken(user.id);

          res.status(201).send({ message: "Success", token: token });
        } else {
          res.status(401).send({ message: "Invalid Credentials" });
        }
      } else {
        res
          .status(400)
          .send({
            message: "Please fill all the required fields.",
          });
      }
    } catch (error) {
      res
        .status(500)
        .send({
          message: "Something went wrong. Plese try again later",
          details: error,
        });
    }
  },
  register: async (req, res) => {
    try {
      if (req.body.password && req.body.username && req.body.email ) {
        if (await User.findOne({ where: { email: req.body.email } })) {
          res.status(409).send({ message: "User already exists" });
        } else {
          const user = await User.create({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
          });
          await user.save();
          const token = await SignToken(user.id);
          res
            .status(201)
            .send({ message: "Registered Successfuly", token: token })
        }
      } else {
        res
          .status(400)
          .send({
            messsage: "Please fill all the required fields",
          });
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
      // Check if the token was provided
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "No access token provided" });
      }

      // Verify the user's token
      await verifyAdmin(req, res);

      // If we've reached this point, the user is an admin
      // Retrieve all users

      // Pagination
      // Get the page number from the query parameter, default to page 0 if not specified
      const page = req.query.page ? parseInt(req.query.page) : 0;

       // Check if the page number is a positive integer
       if (page < 0 || !Number.isInteger(page)) {
        return res.status(400).send({ message: "Page must be 0 or a positive integer" });
      }

      // Set the number of items per page
      const limit = 10; // Number of users per page

      // Calculate the offset based on the page number and limit
      const offset = page * limit;

      // Retrieve users with pagination
      const users = await User.findAll({
        offset: offset,
        limit: limit
      });

      // Construct links for pagination
      const nextPage = `/users?page=${page + 1}`;
      const prevPage = page > 0 ? `/users?page=${page - 1}` : null;

      // Construct links for other related actions
      const links = [
        { rel: "login", href: "/users/login", method: "POST" },
        { rel: "register", href: "/users", method: "POST" },
        { rel: "editProfile", href: "/users/me", method: "PATCH" },
        { rel: "banUser", href: "/users/:userID", method: "PATCH" },
        { rel: "nextPage", href: nextPage, method: "GET" },
        { rel: "prevPage", href: prevPage, method: "GET" }
      ];

      // Return the list of users
      res.status(200).send({users: users, links: links});
    } catch (error) {
      res.status(500).send({ 
        message: "Something went wrong. Please try again later",
        details: error,
      });
    }
  },
  updateUser: async (req, res) => {
    try {
      // Check if the token was provided
      if (!req.headers.authorization) {
        return res.status(401).send({ message: "No access token provided" });
      }

      // Extract token from the request header
      const bearer = req.headers.authorization.split(" ")[1];

      // Verify the user's token
      const decodedToken = await verifyUser(bearer);

      // Check if the user exists
      const user = await User.findByPk(decodedToken.id);
      if (!user) {
        return res.status(404).send({ message: "User Not Found" });
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
      // Handle errors
      if (error.name === "JsonWebTokenError") {
        return res.status(401).send({ message: "Your token has expired! Please login again." });
      }
      res.status(500).send({ 
        message: "Something went wrong. Please try again later",
        details: error,
      });
    }
  }
}; 