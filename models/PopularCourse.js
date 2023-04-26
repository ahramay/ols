const Joi = require("joi");
const mongoose = require("mongoose");

const popularCourseSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  desc: {
    type: String,
  },
  link: {
    type: String,
  },
  image: {
    type: String,
  },
  color: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports.PopularCourse = mongoose.model(
  "popularcourse",
  popularCourseSchema
);

module.exports.validatePopularCourse = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    desc: Joi.string().required(),
    link: Joi.string().required(),
    color: Joi.string().required(),
  });
  return schema.validate(data);
};
