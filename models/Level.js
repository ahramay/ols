const mongoose = require("mongoose");
const Joi = require("joi");

const levelSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Level = mongoose.model("level", levelSchema);

function validateLevel(data) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
  });
  return schema.validate(data);
}

module.exports = {
  Level,
  validateLevel,
};
