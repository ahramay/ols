const Joi = require("joi");
const mongoose = require("mongoose");

const testimonialSliderSchema = mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },

  review: {
    type: String,
    default: "",
  },
  name: {
    type: String,
    default: "",
  },
  rating: {
    type: Number,
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

const TestimonialSlider = mongoose.model(
  "TestimonialSlider",
  testimonialSliderSchema
);

function validateTestimonialSlider(reviewSlider) {
  const schema = Joi.object({
    course: Joi.string().required(),
    review: Joi.string().required(),
    name: Joi.string().required(),
    rating: Joi.number().required(),
  });
  return schema.validate(reviewSlider);
}

exports.TestimonialSlider = TestimonialSlider;
exports.validateTestimonialSlider = validateTestimonialSlider;
