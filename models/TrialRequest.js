const mongoose = require("mongoose");
const Joi = require("joi");

const trialRequestSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    default: "",
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  category: {
    type: String,
    default: "OLevel",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const TrialRequest = mongoose.model("trialrequest", trialRequestSchema);

function validateTrialRequest(input) {
  const schema = Joi.object({
    email: Joi.string().email().min(1).trim().required(),
    firstName: Joi.string().min(1).trim().required(),
    lastName: Joi.string().min(1).trim().required(),
    phoneNumber: Joi.string().min(1).trim().required(),
    category: Joi.string().min(1).trim().required(),
    password: Joi.string().min(1).trim().optional(),
  });
  return schema.validate(input);
}

module.exports = {
  TrialRequest,
  validateTrialRequest,
};
