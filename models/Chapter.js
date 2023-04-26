const mongoose = require("mongoose");
const Joi = require("joi");

const chapterSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  description: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },

  published: {
    type: Boolean,
    default: false,
  },

  buyCount: {
    type: Number,
    default: 0,
  },

  sortOrder: {
    type: Number,
    default: 0,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Chapter = mongoose.model("chapter", chapterSchema);

function validateChapter(data) {
  const schema = Joi.object({
    name: Joi.string().trim().min(1).required(),
    price: Joi.number().min(0).required(),
    course: Joi.objectId().required(),
    description: Joi.string().trim().optional().allow(null),
  });
  return schema.validate(data);
}

module.exports = {
  Chapter,
  validateChapter,
};
