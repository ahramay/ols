const Joi = require("joi");
const mongoose = require("mongoose");

const aboutStorySchema = mongoose.Schema({
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
});

const AboutStory = mongoose.model("aboutstory", aboutStorySchema);

function validateAboutStory(data) {
  const schema = Joi.object({
    heading: Joi.string(),
    text: Joi.string(),
    buttonText: Joi.string(),
    buttonLink: Joi.string(),
  });
  return schema.validate(data);
}

exports.AboutStory = AboutStory;
exports.validateAboutStory = validateAboutStory;
