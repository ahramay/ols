const mongoose = require("mongoose");
const Joi = require("joi");

const languageSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Language = mongoose.model("language", languageSchema);

function validateLanguage(data) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
  });
  return schema.validate(data);
}

module.exports = {
  Language,
  validateLanguage,
};
