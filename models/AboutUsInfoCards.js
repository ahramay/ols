const Joi = require("joi");
const mongoose = require("mongoose");

const aboutusInfoCardSchema = mongoose.Schema({
  heading: {
    type: String,
    default: "",
  },
  text: {
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

const AboutUsInfoCard = mongoose.model(
  "AboutUsInfoCard",
  aboutusInfoCardSchema
);

function validateAboutUsInfoCard(aboutusInfoCard) {
  const schema = Joi.object({
    heading: Joi.string(),
    text: Joi.string(),
  });
  return schema.validate(aboutusInfoCard);
}

exports.AboutUsInfoCard = AboutUsInfoCard;
exports.validateAboutUsInfoCard = validateAboutUsInfoCard;
