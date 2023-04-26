const Joi = require("joi");
const mongoose = require("mongoose");

const whyoutclassInfoCardSchema = mongoose.Schema({
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

const WhyOutClassInfoCard = mongoose.model(
  "WhyOutClassInfoCard",
  whyoutclassInfoCardSchema
);

function validateWhyOutClassInfoCard(infoCard) {
  const schema = Joi.object({
    heading: Joi.string(),
    text: Joi.string(),
  });
  return schema.validate(infoCard);
}

exports.WhyOutClassInfoCard = WhyOutClassInfoCard;
exports.validateWhyOutClassInfoCard = validateWhyOutClassInfoCard;
