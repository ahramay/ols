const mongoose = require("mongoose");
const Joi = require("joi");

const enrollmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },

  chapter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "chapter",
  },

  completeCourse: {
    type: Boolean,
    default: false,
  },

  isActive: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },

  startDate: {
    type: Number,
  },

  endDate: {
    type: Number,
  },
});

const Enrollment = mongoose.model("enrollment", enrollmentSchema);

function validateEnrollment(input) {
  const schema = Joi.object({
    email: Joi.string().email().min(1).trim().required(),
    course: Joi.string().max(30).trim().required(),
    chapters: Joi.array().items(Joi.string()).min(0).required(),
    completeCourse: Joi.boolean().required(),
    startDate: Joi.number().min(0).required(),
    endDate: Joi.number().min(0).required(),
  });
  return schema.validate(input);
}

function validateCategoryEnrollment(input) {
  const schema = Joi.object({
    email: Joi.string().email().min(1).trim().required(),
    category: Joi.string().max(30).trim().required(),
    startDate: Joi.number().min(0).required(),
    endDate: Joi.number().min(0).required(),
  });
  return schema.validate(input);
}
module.exports = {
  Enrollment,
  validateEnrollment,
  validateCategoryEnrollment,
};
