const Joi = require("joi");
const mongoose = require("mongoose");

const homeHeaderSlider = mongoose.Schema({
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
  mobileImage: {
    type: String,
    default: "",
  },
});

const HomeHeaderSlider = mongoose.model("HomeHeaderSlider", homeHeaderSlider);

function validateHomeHeaderSlider(homeHeaderSlider) {
  const schema = Joi.object({
    heading: Joi.string().optional().allow(""),
    text: Joi.string().optional().allow(""),
    buttonText: Joi.string().optional().allow(""),
    buttonLink: Joi.string().optional().allow(""),
  });
  return schema.validate(homeHeaderSlider);
}

exports.HomeHeaderSlider = HomeHeaderSlider;
exports.validateHomeHeaderSlider = validateHomeHeaderSlider;
