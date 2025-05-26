const express = require("express");
const bcrypt = require("bcrypt");
const { userValidation, User } = require("../model/users");
const _ = require("lodash");

const authMdw = require("../middleware/auth");

const router = express.Router();

//GET all USERS in ARRAY
router.get("/", authMdw, async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403).send("Access denied, authorization is only for admin");
  }
  try {
    const users = await User.find({}, { password: 0 });
    if (!users) {
      res.status(400).send("Not found users");
      return;
    }
    //res.send(users)
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

//get user by ID
router.get("/:id", authMdw, async (req, res) => {
  try {
    if (req?.user.isAdmin || req?.user._id === req?.params.id) {
      const userById = await User.findById({ _id: req.params.id });
      if (!userById) {
        res.status(400).send("Sorry,can't found the user");
        return;
      }
      res.send(userById);
    } else {
      res.status(403).send("Access denied");
    }
  } catch (error) {
    console.log(error);
  }
});

//update user
router.put("/:id", authMdw, async (req, res) => {
  try {
    let userToEdit = null;
    const { _id, __v, ...rest } = req.body;
    const { error, value } = userValidation.validate(rest);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    if (req.user.isAdmin || req.user._id === req.params.id) {
      userToEdit = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: value,
        },
        { new: true }
      );
    }
    if (!userToEdit) {
      return res.status(400).send("Don't found user");
    }
    res.send(userToEdit);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

//chance user status
router.patch("/:id", authMdw, async (req, res) => {
  try {
    if (req.user._id != req.params.id) {
      return res.status(400).send("Access denied");
    }
    let userToChange = await User.findByIdAndUpdate(req.params.id, {
      $set: { isBusiness: !req.user.isBusiness },
    });
    if (!userToChange) {
      return res.status(404).send("Access denied or user not found");
    }
    res.send(userToChange);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

//delete user
router.delete("/:id", authMdw, async (req, res) => {
  try {
    if (!req.user.isAdmin && req.user._id != req.params.id) {
      return res.status(400).send("Access denied");
    }
    const userToDelete = await User.findByIdAndDelete(req.params.id);
    if (!userToDelete) {
      res.status(400).send("User not found");
    }
    res.send(userToDelete);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

//CREATE USER
router.post("/", async (req, res) => {
  try {
    const { error, value } = userValidation.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).send("User is already exist");
      return;
    }

    user = await new User({
      ...value,
      password: await bcrypt.hash(req.body.password, 14),
    }).save();

    res.send(user);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

module.exports = router;
