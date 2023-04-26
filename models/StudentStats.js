const Joi = require("joi");
const mongoose = require("mongoose");

const studentStatSchema = new mongoose.Schema({
  score: {
    type: String,
  },
  scoreText: {
    type: String,
  },
  rating: {
    type: String,
  },
  ratingText: {
    type: String,
  },
  ratingSubtext: {
    type: String,
  },
  partnership: {
    type: String,
  },
  partnershipText: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
});

module.exports.StudentStats = mongoose.model("studentstat", studentStatSchema);

module.exports.validateStudentStats = (data) => {
  const schema = Joi.object({
    score: Joi.string().required(),
    scoreText: Joi.string().required(),
    rating: Joi.string().required(),
    ratingText: Joi.string().required(),
    ratingSubtext: Joi.string().required(),
    partnership: Joi.string().required(),
    partnershipText: Joi.string().required(),
  });
  return schema.validate(data);
};
