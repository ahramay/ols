const mongoose = require("mongoose");
const Joi = require("joi");
const courseFeedbackSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    index: true,
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    index: true,
  },

  name: {
    type: String,
  },
  email: {
    type: String,
  },
  message: {
    type: String,
  },

  rating: {
    type: Number,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

function validateCourseFeedback(data) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().required(),
    rating: Joi.number().required().allow(0),
  });
  return schema.validate(data);
}

const CourseFeedback = mongoose.model("coursefeedback", courseFeedbackSchema);

module.exports = {
  CourseFeedback,
  validateCourseFeedback,
};
