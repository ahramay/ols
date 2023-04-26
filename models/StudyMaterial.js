const Joi = require("joi");
const mongoose = require("mongoose");

const studyMaterialSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  image: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports.StudyMaterial = mongoose.model(
  "studymaterial",
  studyMaterialSchema
);

module.exports.validateStudyMaterial = (data) => {
  const schema = Joi.object({
    text: Joi.string().required(),
  });
  return schema.validate(data);
};
