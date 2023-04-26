const Joi = require("joi");
const mongoose = require("mongoose");

const footerSchema = mongoose.Schema({
  paragraph: {
    type: String,
    default: "",
  },
  copyrightText: {
    type: String,
    default: "",
  },
});

const Footer = mongoose.model("Footer", footerSchema);

function validateFooter(footer) {
  const schema = Joi.object({
    paragraph: Joi.string(),
    copyrightText: Joi.string(),
  });
  return schema.validate(footer);
}

exports.Footer = Footer;
exports.validateFooter = validateFooter;
