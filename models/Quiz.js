const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");

const mediaPath = config.get("mediaPath");

const quizSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "lesson",
    },
    showInVideoTime: {
      type: String,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

function validateQuiz(input) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    type: Joi.string().min(1).required(),
    lesson: Joi.objectId().required(),
    showInVideoTime: Joi.string().optional().allow(null),
  });
  return schema.validate(input);
}

const Quiz = mongoose.model("quiz", quizSchema);

module.exports = {
  Quiz,
  validateQuiz,
};
