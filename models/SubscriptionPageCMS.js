const { string } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

const subscriptionPageCmsSchema = mongoose.Schema({
  heading: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  text2: {
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

  ///Subscription Modal

  topHeading: {
    type: String,
    default: "",
  },
  coursesSelectedHeading: {
    type: String,
    default: "",
  },

  priceLabel: {
    type: String,
    default: "",
  },

  confirmation: {
    type: String,
    default: "",
  },

  subPer: {
    type: String,
    default: "",
  },

  bottomHeading: {
    type: String,
    default: "",
  },
});

const SubscriptionPageCMS = mongoose.model(
  "subscriptionpagecms",
  subscriptionPageCmsSchema
);

function validateSubscriptionPageCms(data) {
  const schema = Joi.object({
    heading: Joi.string(),
    text: Joi.string(),
    text2: Joi.string(),
    buttonText: Joi.string(),
    buttonLink: Joi.string(),
    metaTitle: Joi.string(),
    metaDescription: Joi.string(),
    metaKeyWords: Joi.string(),

    //modal
    topHeading: Joi.string().required(),
    coursesSelectedHeading: Joi.string().required(),
    priceLabel: Joi.string().required(),
    confirmation: Joi.string().required(),
    subPer: Joi.string().required(),
    bottomHeading: Joi.string().required(),
  });
  return schema.validate(data);
}

exports.SubscriptionPageCMS = SubscriptionPageCMS;
exports.validateSubscriptionPageCms = validateSubscriptionPageCms;
