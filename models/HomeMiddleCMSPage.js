const { optional } = require("joi");
const Joi = require("joi");
const mongoose = require("mongoose");

const homeMiddleSchema = mongoose.Schema({
  heading1: {
    type: String,
  },
  text1: {
    type: String,
  },

  image: {
    type: String,
  },
  heading2: {
    type: String,
  },
  text2: {
    type: String,
  },
  image2: {
    type: String,
  },
  heading3: {
    type: String,
  },
  text3: {
    type: String,
  },
  image3: {
    type: String,
  },
  heading4: {
    type: String,
  },
  text4: {
    type: String,
  },
  image4: {
    type: String,
  },
  heading5: {
    type: String,
  },
  text5: {
    type: String,
  },
  image5: {
    type: String,
  },
  heading6: {
    type: String,
  },
  text6: {
    type: String,
  },
  image6: {
    type: String,
  },
  heading7: {
    type: String,
  },
  text7: {
    type: String,
  },
  image7: {
    type: String,
  },
  heading8: {
    type: String,
  },
  text8: {
    type: String,
  },
  image8: {
    type: String,
  },
});

const HomeMiddle = mongoose.model("homeMiddle", homeMiddleSchema);

function validateHomeMiddle(data) {
  const schema = Joi.object({
    heading1: Joi.string().optional().trim(),
    text1: Joi.string().optional().trim(),
    heading2: Joi.string().optional().trim(),
    text2: Joi.string().optional().trim(),
    heading3: Joi.string().optional().trim(),
    text3: Joi.string().optional().trim(),
    heading4: Joi.string().optional().trim(),
    text4: Joi.string().optional().trim(),
    heading5: Joi.string().optional().trim(),
    text5: Joi.string().optional().trim(),
    heading6: Joi.string().optional().trim(),
    text6: Joi.string().optional().trim(),
    heading7: Joi.string().optional().trim(),
    text7: Joi.string().optional().trim(),
    heading8: Joi.string().optional().trim(),
    text8: Joi.string().optional().trim(),
  });
  return schema.validate(data);
}

exports.HomeMiddle = HomeMiddle;
exports.validateHomeMiddle = validateHomeMiddle;
