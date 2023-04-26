const Joi = require("joi");
const mongoose = require("mongoose");

const teacherPageCmsDataSchema = mongoose.Schema({
  mainHeading: {
    type: String,
    default: "",
  },
  //Explore our popular courses
  text1: {
    type: String,
    default: "",
  },
  heading1: {
    type: String,
    default: "",
  },
  metaTitle: {
    type: String,
    default: "",
  },
  metaDescription: {
    type: String,
    default: "",
  },
  metaKeyWords: {
    type: String,
    default: "",
  },
});

const TeacherPageCMSData = mongoose.model(
  "teacherpagecmsdata",
  teacherPageCmsDataSchema
);

function validateTeacherPageCMSData(data) {
  const schema = Joi.object({
    mainHeading: Joi.string().allow(""),
    text1: Joi.string().allow(""),
    heading1: Joi.string().allow(""),
    metaTitle: Joi.string(),
    metaDescription: Joi.string(),
    metaKeyWords: Joi.string(),
  });
  return schema.validate(data);
}

exports.TeacherPageCMSData = TeacherPageCMSData;
exports.validateTeacherPageCMSData = validateTeacherPageCMSData;
