const Joi = require("joi");
const mongoose = require("mongoose");

const freeVideosPageCmsDataSchema = mongoose.Schema({
  //Find Out More
  buttonText1: {
    type: String,
    default: "",
  },
  buttonLink1: {
    type: String,
    default: "",
  },
  //Bringing YEARS of global Educational experience from top
  text1: {
    type: String,
    default: "",
  },
  //Explore our popular courses
  heading1: {
    type: String,
    default: "",
  },
  //Meet the best teachers
  heading2: {
    type: String,
    default: "",
  },
  //Find Out More
  buttonText2: {
    type: String,
    default: "",
  },
  buttonLink2: {
    type: String,
    default: "",
  },
  //Grow With Us!
  heading3: {
    type: String,
    default: "",
  },

  //Diam ducimus tempora minima,
  text2: {
    type: String,
    default: "",
  },
  //What our students have to say
  heading4: {
    type: String,
    default: "",
  },
  //What are you waiting for?
  heading5: {
    type: String,
    default: "",
  },
  //Lorem ipsum dolor sit amet
  text3: {
    type: String,
    default: "",
  },
  //Join For Free
  buttonText3: {
    type: String,
    default: "",
  },
  buttonLink3: {
    type: String,
    default: "",
  },
  img1: {
    type: String,
  },
  coursesBtnText: {
    type: String,
    default: "",
  },
  coursesBtnLink: {
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

const FreeVideosPageCMSData = mongoose.model(
  "FreeVideosPageCMSData",
  freeVideosPageCmsDataSchema
);

function validateFreeVideosPageCMSData(homePageCmsData) {
  const schema = Joi.object({
    heading1: Joi.string().allow(""),
    heading2: Joi.string().allow(""),
    heading3: Joi.string().allow(""),
    heading4: Joi.string().allow(""),
    heading5: Joi.string().allow(""),
    text1: Joi.string().allow(""),
    text2: Joi.string().allow(""),
    text3: Joi.string().allow(""),
    buttonText1: Joi.string().allow(""),
    buttonLink1: Joi.string().allow(""),
    buttonText2: Joi.string().allow(""),
    buttonLink2: Joi.string().allow(""),
    buttonText3: Joi.string().allow(""),
    buttonLink3: Joi.string().allow(""),
    coursesBtnText: Joi.string().allow(""),
    coursesBtnLink: Joi.string().allow(""),
    metaTitle: Joi.string().allow(""),
    metaDescription: Joi.string().allow(""),
    metaKeyWords: Joi.string().allow(""),
  });
  return schema.validate(homePageCmsData);
}

exports.FreeVideosPageCMSData = FreeVideosPageCMSData;
exports.validateFreeVideosPageCMSData = validateFreeVideosPageCMSData;
