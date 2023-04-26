const Joi = require("joi");
const mongoose = require("mongoose");

const freeVideoSecSchema = mongoose.Schema({
  heading: {
    type: String,
    default: "",
  },
  text: {
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
});

const FreeVideoSec = mongoose.model("freeVideoSec", freeVideoSecSchema);

function validateFreeVideoSec(data) {
  const schema = Joi.object({
    heading: Joi.string(),
    text: Joi.string(),
    buttonText: Joi.string(),
    buttonLink: Joi.string(),
  });
  return schema.validate(data);
}

exports.FreeVideoSec = FreeVideoSec;
exports.validateFreeVideoSec = validateFreeVideoSec;
