const Joi = require("joi");
const mongoose = require("mongoose");

const cartCmsSchema = mongoose.Schema({
  heading1: {
    type: String,
    default: "",
  },
  text1: {
    type: String,
    default: "",
  },

  heading2: {
    type: String,
    default: "",
  },
  text2: {
    type: String,
    default: "",
  },

  heading3: {
    type: String,
    default: "",
  },
  text3: {
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

const CartCMS = mongoose.model("cartcmsschema", cartCmsSchema);

function validateCartCMSData(howtopayData) {
  const schema = Joi.object({
    heading1: Joi.string(),
    text1: Joi.string(),
    heading2: Joi.string(),
    text2: Joi.string(),
    heading3: Joi.string(),
    text3: Joi.string(),
  });
  return schema.validate(howtopayData);
}

exports.CartCMS = CartCMS;
exports.validateCartCMSData = validateCartCMSData;
