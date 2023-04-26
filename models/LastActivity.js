const mongoose = require("mongoose");
const Joi = require("joi");

const lastActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    index: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },

  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lesson",
  },

  duration: {
    type: Number,
  },
});

const LastActivity = mongoose.model("lastactivity", lastActivitySchema);

function validateLastActivity(data) {
  const schema = Joi.object({
    course: Joi.string().min(1).max(50).required(),
    lesson: Joi.string().min(1).max(50).required(),
    duration: Joi.number().min(0).optional().allow(null),
  });

  return schema.validate(data);
}

module.exports = {
  LastActivity,
  validateLastActivity,
};
