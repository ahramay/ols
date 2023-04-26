const Joi = require("joi");
const mongoose = require("mongoose");

const whyoutclassList = mongoose.Schema({
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

const WhyOutClassList = mongoose.model("WhyOutClassList", whyoutclassList);

function validateWhyOutClassList(list) {
  const schema = Joi.object({
    heading: Joi.string(),
    text: Joi.string(),
  });
  return schema.validate(list);
}

exports.WhyOutClassList = WhyOutClassList;
exports.validateWhyOutClassList = validateWhyOutClassList;
