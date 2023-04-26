const Joi = require("joi");
const mongoose = require("mongoose");

const aboutusCmsDataSchema = mongoose.Schema({
  //About Us Home/About Us
  mainHeading: {
    type: String,
    default: "",
  },
  subText1: {
    type: String,
    default: "",
  },
  subText1Link: {
    type: String,
    default: "",
  },
  subText2: {
    type: String,
    default: "",
  },
  //Our Story
  heading1: {
    type: String,
    default: "",
  },

  //There are many variations of passages of lorem ipsum available,
  text1: {
    type: String,
    default: "",
  },
  //Our Value
  heading2: {
    type: String,
    default: "",
  },
  image1: {
    type: String,
    default: "",
  },
  //Our Team
  heading3: {
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

const AboutUsCMSData = mongoose.model("AboutUsCMSData", aboutusCmsDataSchema);

function validateAboutUsCMSData(aboutusCMSData) {
  const schema = Joi.object({
    mainHeading: Joi.string(),
    subText1: Joi.string(),
    subText1Link: Joi.string(),
    subText2: Joi.string(),
    heading1: Joi.string(),
    text1: Joi.string(),
    heading2: Joi.string(),
    heading3: Joi.string(),
    metaTitle: Joi.string(),
    metaDescription: Joi.string(),
    metaKeyWords: Joi.string(),
  });
  return schema.validate(aboutusCMSData);
}

exports.AboutUsCMSData = AboutUsCMSData;
exports.validateAboutUsCMSData = validateAboutUsCMSData;
