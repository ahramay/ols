const Joi = require("joi");
const mongoose = require("mongoose");

const commonSiteDataSchema = mongoose.Schema({
  robotTxt: {
    type: String,
    default: "",
  },
  logo: {
    type: String,
    default: "",
  },
  loginModalImage: {
    type: String,
  },
  registerModalImage: {
    type: String,
  },
  facebookLink: {
    type: String,
    default: "",
  },
  linkedInLink: {
    type: String,
    default: "",
  },
  twitterLink: {
    type: String,
    default: "",
  },
  instagramLink: {
    type: String,
    default: "",
  },
  contactNumber: {
    type: String,
  },
});

const CommonSiteData = mongoose.model("CommonSiteData", commonSiteDataSchema);

function validateCommonSiteData(commonData) {
  const schema = Joi.object({
    facebookLink: Joi.string().allow(""),
    linkedInLink: Joi.string().allow(""),
    twitterLink: Joi.string().allow(""),
    instagramLink: Joi.string().allow(""),
    contactNumber: Joi.string().allow(""),
  });
  return schema.validate(commonData);
}

exports.CommonSiteData = CommonSiteData;
exports.validateCommonSiteData = validateCommonSiteData;
