const Joi = require("joi");
const mongoose = require("mongoose");

const contactusCMSDataSchema = mongoose.Schema({
  //Contact Us
  mainHeading: {
    type: String,
    default: "",
  },

  //Connect with us
  heading1: {
    type: String,
    default: "",
  },
  //Get in touch with us
  heading2: {
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

const ContactUsCMSData = mongoose.model(
  "ContactUsCMSData",
  contactusCMSDataSchema
);

function validateContactUsCMSData(contactusData) {
  const schema = Joi.object({
    mainHeading: Joi.string(),
    heading1: Joi.string(),
    heading2: Joi.string(),
    metaTitle: Joi.string(),
    metaDescription: Joi.string(),
    metaKeyWords: Joi.string(),
  });
  return schema.validate(contactusData);
}

exports.ContactUsCMSData = ContactUsCMSData;
exports.validateContactUsCMSData = validateContactUsCMSData;
