const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, signInValidation } = require("../model/users");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { error } = signInValidation.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(400).send("Invalid Email");
      return;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      res.status(400).send("Invalid password");
      return;
    }

    const token = jwt.sign(
      {
        _id: user._id,
        isBusiness: user.isBusiness,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET
    );

    console.log("Token generated:", token);
    res.send(token);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

module.exports = router;
