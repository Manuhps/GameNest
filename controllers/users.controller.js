const { User } = require("../models/index");
const { compareHash } = require("./bcrypt");
const { SignToken } = require("./jwt");

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
}; 