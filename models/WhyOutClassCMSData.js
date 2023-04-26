const Joi = require("joi");
const mongoose = require("mongoose");

const whyoutclassCMSDataSchema = mongoose.Schema({
  //Why Out-Class Home/Why Out-Class
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
  //Lorem ipsum dolor sit amet, consectetur adipiscing elit,
  text1: {
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

const WhyOutClassCMSData = mongoose.model(
  "WhyOutClassCMSData",
  whyoutclassCMSDataSchema
);

function validateWhyOutClassCMSData(whyoutclassData) {
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
  return schema.validate(whyoutclassData);
}

exports.WhyOutClassCMSData = WhyOutClassCMSData;
exports.validateWhyOutClassCMSData = validateWhyOutClassCMSData;
