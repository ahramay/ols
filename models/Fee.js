const Joi = require("joi");
const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema({
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

module.exports.Fee = mongoose.model("fee", feeSchema);

module.exports.validateFee = (data) => {
  const schema = Joi.object({
    text: Joi.string().required(),
  });
  return schema.validate(data);
};
