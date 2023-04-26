const mongoose = require("mongoose");
const Joi = require("joi");

const courseMenu = new mongoose.Schema({
  promoImage: {
    type: String,
    default: "",
  },
  topHeading: {
    type: String,
    default: "",
  },
  //basic
  oLevelLinks: {
    type: String,
    default: "",
    required: true,
  },

  oLevelImage: {
    type: String,
    default: "",
  },
  //plus
  satPrepLinks: {
    type: String,
    default: "",
    required: true,
  },

  satPrepImage: {
    type: String,
    default: "",
  },

  //premium
  aLevelLinks: {
    type: String,
    default: "",
    required: true,
  },

  aLevelImage: {
    type: String,
    default: "",
  },
});

const CourseMenu = mongoose.model("courseMenu", courseMenu);

function validateCourseMenu(data) {
  const schema = Joi.object({
    topHeading: Joi.string().required(),
    oLevelLinks: Joi.string().required(),
    satPrepLinks: Joi.string().required(),
    aLevelLinks: Joi.string().required(),
  });
  return schema.validate(data);
}

module.exports = {
  CourseMenu,
  validateCourseMenu,
};
