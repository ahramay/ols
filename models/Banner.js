const Joi = require("joi");
const mongoose = require("mongoose");

const bannerSchema = mongoose.Schema({
  text: {
    type: String,
    default: "",
  },
  link: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Banner = mongoose.model("Banner", bannerSchema);

function validateBanner(reviewBanner) {
  const schema = Joi.object({
    text: Joi.string().required(),
    link: Joi.string().required(),
  });
  return schema.validate(reviewBanner);
}

exports.Banner = Banner;
exports.validateBanner = validateBanner;
