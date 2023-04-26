const Joi = require("joi");
const mongoose = require("mongoose");

const howtopayCMSDataSchema = mongoose.Schema({
  //How To Pay Home/How To Pay
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
  //How to Pay second
  heading1: {
    type: String,
    default: "",
  },
  //Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
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

const HowToPayCMSData = mongoose.model(
  "HowToPayCMSData",
  howtopayCMSDataSchema
);

function validateHowToPayCMSData(howtopayData) {
  const schema = Joi.object({
    mainHeading: Joi.string(),
    subText1: Joi.string(),
    subText1Link: Joi.string(),
    subText2: Joi.string(),
    heading1: Joi.string(),
    text1: Joi.string(),
    metaTitle: Joi.string(),
    metaDescription: Joi.string(),
    metaKeyWords: Joi.string(),
  });
  return schema.validate(howtopayData);
}

exports.HowToPayCMSData = HowToPayCMSData;
exports.validateHowToPayCMSData = validateHowToPayCMSData;
