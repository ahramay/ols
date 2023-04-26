const Joi = require("joi");
const mongoose = require("mongoose");

const whatsNewSchema = new mongoose.Schema({
  buttonName: {
    type: String,
  },
  link: {
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

module.exports.WhatsNew = mongoose.model("whatsnew", whatsNewSchema);

module.exports.validateWhatsNew = (data) => {
  const schema = Joi.object({
    buttonName: Joi.string().required(),
    link: Joi.string().required(),
  });
  return schema.validate(data);
};
