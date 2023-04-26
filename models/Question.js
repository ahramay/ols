const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");
const mediaPath = config.get("mediaPath");

const questionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },

    type: {
      type: String,
    },

    image: {
      type: String,
      get: (image) => {
        if (!image) return "";
        return mediaPath + `uploads/images/${image}`;
      },
    },

    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "quiz",
    },

    marks: {
      type: Number,
      default: 1,
    },

    reference: {
      type: String,
      default: "",
    },

    options: {
      type: [Object],
    },

    allowedTime: {
      type: String,
      default: "",
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

function validateQuestion(input) {
  const schema = Joi.object({
    name: Joi.string().min(2).required().allow(""),
    type: Joi.string().min(1).required(),
    marks: Joi.number().min(1).required(),
    quiz: Joi.objectId().required(),
    options: Joi.array().optional(),
    allowedTime: Joi.string().min(0).optional().allow(""),
    reference: Joi.string().min(0).optional().allow(""),
  });
  return schema.validate(input);
}

const Question = mongoose.model("question", questionSchema);

module.exports = {
  Question,
  validateQuestion,
};
