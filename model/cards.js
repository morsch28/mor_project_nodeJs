const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const cardsSchema = new mongoose.Schema({
  title: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 256,
  },
  subtitle: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 256,
  },
  description: {
    required: true,
    type: String,
    minlength: 2,
    maxlength: 1024,
  },
  phone: {
    required: true,
    type: String,
    minlength: 9,
    maxlength: 11,
  },
  email: {
    required: true,
    type: String,
    minlength: 5,
  },
  web: {
    type: String,
    minlength: 14,
  },
  image: {
    url: {
      type: String,
    },
    alt: {
      type: String,
      minlength: 2,
      maxlength: 256,
    },
  },
  address: {
    state: {
      type: String,
      minlength: 2,
      maxlength: 256,
    },
    country: {
      required: true,
      type: String,
      minlength: 2,
      maxlength: 256,
    },
    city: {
      required: true,
      type: String,
      minlength: 2,
      maxlength: 256,
    },
    street: {
      required: true,
      type: String,
      minlength: 2,
      maxlength: 256,
    },
    houseNumber: {
      required: true,
      type: Number,
      minlength: 2,
      maxlength: 256,
    },
    zip: {
      type: Number,
      minlength: 2,
      maxlength: 256,
    },
  },
  bizNumber: {
    type: Number,
    min: 100,
    max: 9_999_999_999,
    unique: true,
    required: true,
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Card = mongoose.model("Card", cardsSchema, "cards");

async function generateBizNumber() {
  while (true) {
    const random = _.random(100, 9_999_999_999);
    const card = await Card.findOne({ bizNumber: random });
    if (!card) {
      return random;
    }
  }
}

const validation = {
  title: Joi.string().min(2).max(256).required(),
  subtitle: Joi.string().min(2).max(256).required(),
  description: Joi.string().min(2).max(256).required(),
  phone: Joi.string().min(9).max(11).required(),
  email: Joi.string().min(5).required(),
  web: Joi.string().min(14),
  image: Joi.object({
    url: Joi.string().min(14).allow(""),
    alt: Joi.string().min(2).max(256),
  }).required(),
  address: Joi.object({
    state: Joi.string().min(2).max(256),
    country: Joi.string().min(2).max(256).required(),
    city: Joi.string().min(2).max(256).required(),
    street: Joi.string().min(2).max(256).required(),
    houseNumber: Joi.number().min(2).max(256).required(),
    zip: Joi.number().min(2).max(256),
  }).required(),
};

const cardValidation = Joi.object(validation);

module.exports = {
  Card,
  cardValidation,
  generateBizNumber,
};
