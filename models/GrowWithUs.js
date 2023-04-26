const Joi = require("joi");
const mongoose = require("mongoose");

const homePageCmsDataSchema = mongoose.Schema({
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

const HomePageCMSData = mongoose.model(
  "HomePageCMSData",
  homePageCmsDataSchema
);

function validateHomePageCMSData(homePageCmsData) {
  const schema = Joi.object({
    heading1: Joi.string(),
    heading2: Joi.string(),
    heading3: Joi.string(),
    heading4: Joi.string(),
    heading5: Joi.string(),
    text1: Joi.string(),
    text2: Joi.string(),
    text3: Joi.string(),
    buttonText1: Joi.string(),
    buttonLink1: Joi.string(),
    buttonText2: Joi.string(),
    buttonLink2: Joi.string(),
    buttonText3: Joi.string(),
    buttonLink3: Joi.string(),
    metaTitle: Joi.string(),
    metaDescription: Joi.string(),
    metaKeyWords: Joi.string(),
  });
  return schema.validate(homePageCmsData);
}

exports.HomePageCMSData = HomePageCMSData;
exports.validateHomePageCMSData = validateHomePageCMSData;
