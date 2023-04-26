const Joi = require("joi");
const mongoose = require("mongoose");

const faqSchema = mongoose.Schema({
  question: {
    type: String,
    default: "",
  },
  answer: {
    type: String,
    default: "",
  },
  student: {
    type: Boolean,
    default: true,
  },
  teacher: {
    type: Boolean,
    default: true,
  },
  parent: {
    type: Boolean,
    default: true,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

const Faq = mongoose.model("faqSchema", faqSchema);

function validateFaqSchema(stats) {
  const schema = Joi.object({
    question: Joi.string(),
    answer: Joi.string(),
    student: Joi.boolean(),
    teacher: Joi.boolean(),
    parent: Joi.boolean(),
  });
  return schema.validate(stats);
}

exports.Faq = Faq;
exports.validateFaqSchema = validateFaqSchema;
