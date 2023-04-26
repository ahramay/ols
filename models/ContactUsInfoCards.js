const Joi = require("joi");
const mongoose = require("mongoose");

const contactusInfoCardSchema = mongoose.Schema({
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

const ContactUsInfoCard = mongoose.model(
  "ContactUsInfoCard",
  contactusInfoCardSchema
);

function validateContactUsInfoCard(contactusInfoCard) {
  const schema = Joi.object({
    heading: Joi.string(),
    text: Joi.string(),
  });
  return schema.validate(contactusInfoCard);
}

exports.ContactUsInfoCard = ContactUsInfoCard;
exports.validateContactUsInfoCard = validateContactUsInfoCard;
