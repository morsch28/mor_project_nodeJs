const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const userSchema = new mongoose.Schema({
  name: {
    first: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    middle: {
      type: String,
      default: "",
    },
    last: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
  },
  phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 11,
  },
  email: {
    type: String,
    required: true,
    minlength: 6,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 1024,
  },
  image: {
    url: {
      type: String,
      default: "",
    },
    alt: {
      type: String,
      default: "",
    },
  },
  address: {
    state: {
      type: String,
      minlength: 2,
      maxlength: 256,
    },
    country: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    city: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    street: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    houseNumber: {
      type: Number,
      required: true,
      minlength: 2,
      maxlength: 256,
    },
    zip: {
      type: Number,
      default: 0,
      minlength: 2,
      maxlength: 256,
    },
  },
  isBusiness: {
    type: Boolean,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema, "users");

const validation = {
  name: Joi.object({
    first: Joi.string().min(2).max(256).required(),
    middle: Joi.string().min(2).max(256).allow(""),
    last: Joi.string().min(2).max(256).required(),
  }).required(),
  phone: Joi.string().min(9).max(11).required(),
  email: Joi.string().min(6).required(),
  password: Joi.string().min(7).max(1024).required(),
  image: Joi.object({
    url: Joi.string().min(14).allow(""),
    alt: Joi.string().min(2).max(256).allow(""),
  }).required(),
  address: Joi.object({
    state: Joi.string().min(2).max(256),
    country: Joi.string().min(2).max(256).required(),
    city: Joi.string().min(2).max(256).required(),
    street: Joi.string().min(2).max(256).required(),
    houseNumber: Joi.number().min(2).max(256).required(),
    zip: Joi.number().min(2).max(256).default(0),
  }).required(),
  isBusiness: Joi.boolean().required(),
  isAdmin: Joi.boolean().default(false),
};

const userValidation = Joi.object(validation).required();
const signInValidation = Joi.object(_.pick(validation, ["email", "password"]));

module.exports = {
  User,
  userValidation,
  signInValidation,
};
