const mongoose = require("mongoose");
const Joi = require("joi");

const myCourse = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },

  chapters: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "chapter",
  },

  chapterEnrollments: {
    type: [
      new mongoose.Schema({
        chapter: { type: mongoose.Schema.Types.ObjectId, ref: "chapter" },

        startDate: {
          type: Number,
        },

        endDate: {
          type: Number,
        },
      }),
    ],
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

  feedbackAsked: {
    type: Boolean,
    default: false,
  },
});

const MyCourse = mongoose.model("mycourse", myCourse);

function validateEnrollment(input) {
  const schema = Joi.object({
    email: Joi.string().email().min(1).trim().required(),
    course: Joi.string().max(30).trim().required(),
    chapters: Joi.array().items(Joi.string()).min(0).required(),
    chapterEnrollments: Joi.array().min(0).required(),
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
  MyCourse,
  validateEnrollment,
  validateCategoryEnrollment,
};
