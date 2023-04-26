const Joi = require("joi");
const mongoose = require("mongoose");

const homeFreeVideoSecSchema = mongoose.Schema({
  heading: {
    type: String,
    default: "",
  },
  heading2: {
    type: String,
    default: "",
  },
  buttonText: {
    type: String,
    default: "",
  },
  buttonLink: {
    type: String,
    default: "",
  },

  heading3: {
    type: String,
    default: "",
  },
  heading4: {
    type: String,
    default: "",
  },

  buttonText2: {
    type: String,
    default: "",
  },
  buttonLink2: {
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
});

const CoursePageCmsData = mongoose.model(
  "coursepagecmsdata",
  homeFreeVideoSecSchema
);

function validateCoursePage(data) {
  const schema = Joi.object({
    heading: Joi.string(),
    heading2: Joi.string(),
    heading3: Joi.string(),
    heading4: Joi.string(),
    buttonText: Joi.string(),
    buttonLink: Joi.string(),
    buttonText2: Joi.string(),
    buttonLink2: Joi.string(),
  });
  return schema.validate(data);
}

exports.CoursePageCmsData = CoursePageCmsData;
exports.validateCoursePage = validateCoursePage;
