const Joi = require("joi");
const mongoose = require("mongoose");

const infoCardSchema = mongoose.Schema({
  heading: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },

  link: {
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

const InfoCard = mongoose.model("InfoCard", infoCardSchema);

function validateInfoCard(infoCard) {
  const schema = Joi.object({
    heading: Joi.string(),
    link: Joi.string(),
    text: Joi.string(),
  });
  return schema.validate(infoCard);
}

exports.InfoCard = InfoCard;
exports.validateInfoCard = validateInfoCard;
