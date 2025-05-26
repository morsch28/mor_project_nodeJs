const express = require("express");
const authMdw = require("../middleware/auth");

const { Card, cardValidation, generateBizNumber } = require("../model/cards");

const router = express.Router();

//get all cards = all user
router.get("/", async (req, res) => {
  try {
    const cards = await Card.find();
    res.send(cards);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

//get my cards - register user
router.get("/my-cards", authMdw, async (req, res) => {
  try {
    const myCards = await Card.find({ user_id: req.user._id });
    if (!myCards) {
      res.status(400).send("Don't found cards");
      return;
    }
    res.send(myCards);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

//get card by id - all users
router.get("/:id", async (req, res) => {
  try {
    const cardById = await Card.findById(req.params.id);
    if (!cardById) {
      res.status(400).send("The Card Not Found");
      return;
    }
    res.json(cardById);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

//create new card-business user
router.post("/", authMdw, async (req, res) => {
  try {
    const { error } = cardValidation.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    if (!req.user.isBusiness && !req.user.isAdmin) {
      res.status(400).send("No authorization, user must be business");
      return;
    }

    const newCard = await new Card({
      ...req.body,
      user_id: req.user._id,
      bizNumber: await generateBizNumber(),
    }).save();

    res.json(newCard);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

//edit card - the owner of card
router.put("/:id", authMdw, async (req, res) => {
  try {
    const { error, value } = cardValidation.validate(req.body);
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    console.log(req.body, value);
    const cardToUpdate = await Card.findById(req.params.id);
    if (!cardToUpdate) {
      res.status(404).send("Not found");
      return;
    }

    console.log(cardToUpdate.user_id.toString(), req.user._id);
    if (cardToUpdate.user_id.toString() !== req.user._id) {
      return res.status(404).send("You can't modify this card");
    }
    const updated = await Card.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      res.status(404).send("Not Found");
      return;
    }
    res.json(updated);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

//like card - register user
router.patch("/:id", authMdw, async (req, res) => {
  try {
    const cardToLike = await Card.findById(req.params.id);
    if (!cardToLike) {
      return res.status(404).send("Not found");
    }

    if (cardToLike.likes.includes(req.user._id)) {
      const indexOfLike = cardToLike.likes.indexOf(req.user._id);
      cardToLike.likes.splice(indexOfLike, 1);
      cardToLike.save();
    } else {
      cardToLike.likes.push(req.user._id);
      cardToLike.save();
    }

    res.json(cardToLike);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

//delete card - onwer/admin
router.delete("/:id", authMdw, async (req, res) => {
  try {
    const cardToDelete = await Card.findByIdAndDelete(req.params.id);
    if (req.user._id !== cardToDelete.user_id.toString() && !req.user.isAdmin) {
      return res.status(404).send("Access denied");
    }
    if (!cardToDelete) {
      return res.status(400).send("Don't found");
    }
    res.json(cardToDelete);
  } catch (error) {
    res.status(error.status).send(error.message);
  }
});

router.patch("/:id/:biz", authMdw, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).send("Access denied");
    }
    const allCards = await Card.find();
    if (allCards.some((card) => card.bizNumber.toString() === req.params.biz)) {
      return res.status(400).send("biz number already taken");
    }
    const cardToUpdate = await Card.findById(req.params.id);
    if (!cardToUpdate) {
      return res.status(400).send("Don't found");
    }
    cardToUpdate.bizNumber = Number(req.params.biz);
    cardToUpdate.save();
    res.send(cardToUpdate);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
