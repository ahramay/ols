const Joi = require("joi");
const mongoose = require("mongoose");

const navbarSchema = mongoose.Schema({
  name: {
    type: String,
  },
  link: {
    type: String,
  },
  image: {
    type: String,
  },
  highLightText: {
    type: String,
  },
  showInHeader: {
    type: Boolean,
    default: false,
  },
  showInFooter: {
    type: Boolean,
    default: false,
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

const NavBar = mongoose.model("NavBar", navbarSchema);

function validateNavBar(navbar) {
  const schema = Joi.object({
    name: Joi.string().required(),
    link: Joi.string().required(),
    highLightText: Joi.string().optional().allow(""),
  });
  return schema.validate(navbar);
}

function validateNavBarUponUpdate(navbar) {
  const schema = Joi.object({
    name: Joi.string(),
    link: Joi.string(),
    highLightText: Joi.string().optional().allow(""),
  });
  return schema.validate(navbar);
}

exports.NavBar = NavBar;
exports.validateNavBar = validateNavBar;
exports.validateNavBarUponUpdate = validateNavBarUponUpdate;
