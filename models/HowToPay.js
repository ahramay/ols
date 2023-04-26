const Joi = require("joi");
const mongoose = require("mongoose");

const howToPaySchema = mongoose.Schema({
  heading: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  buttonText: {
    type: String,
    default: "",
  },
  buttonLink: {
    type: String,
    default: "",
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
    default: "",
  },
  metaTitle: {
    type: String,
    default: "",
  },
  metaDescription: {
    type: String,
    default: "",
  },
  metaKeyWords: {
    type: String,
    default: "",
  },
});

const HowToPay = mongoose.model("howtopay", howToPaySchema);

function validateHowToPay(data) {
  const schema = Joi.object({
    heading: Joi.string(),
    text: Joi.string(),
    buttonText: Joi.string(),
    buttonLink: Joi.string(),
    metaTitle: Joi.string().allow(""),
    metaDescription: Joi.string().allow(""),
    metaKeyWords: Joi.string().allow(""),
  });
  return schema.validate(data);
}

exports.HowToPay = HowToPay;
exports.validateHowToPay = validateHowToPay;
