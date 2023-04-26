const Joi = require("joi");
const mongoose = require("mongoose");

const studentReviewsSliderSchema = mongoose.Schema({
  review: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  designation: {
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
  rating: {
    type: Number,
    default: 0,
  },
});

const StudentReviewsSlider = mongoose.model(
  "StudentReviewsSlider",
  studentReviewsSliderSchema
);

function validateStudentReviewsSlider(reviewSlider) {
  const schema = Joi.object({
    review: Joi.string().required(),
    name: Joi.string().required(),
    designation: Joi.string().required(),
    rating: Joi.number().min(1).max(5).required(),
  });
  return schema.validate(reviewSlider);
}

exports.StudentReviewsSlider = StudentReviewsSlider;
exports.validateStudentReviewsSlider = validateStudentReviewsSlider;
