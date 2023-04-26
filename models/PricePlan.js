const Joi = require("joi");
const mongoose = require("mongoose");

const pricePlanSchema = mongoose.Schema({
  subscriptionPlan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subscriptionplan",
  },
  price: {
    type: Number,
    required: true,
  },
  numberOfDays: {
    type: Number,
    required: true,
  },

  accessText: {
    type: String,
    default: "",
  },
  saleText: {
    type: String,
    default: "",
  },

  bottomAccessText: {
    type: String,
    default: "",
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

const PricePlan = mongoose.model("priceplan", pricePlanSchema);

function validatePricePlan(data) {
  const schema = Joi.object({
    subscriptionPlan: Joi.objectId().required(),
    bottomAccessText: Joi.string().required(),
    price: Joi.number().required(),
    numberOfDays: Joi.number().required(),
    accessText: Joi.string().required(),
    saleText: Joi.string().optional().allow(""),
  });
  return schema.validate(data);
}

exports.PricePlan = PricePlan;
exports.validatePricePlan = validatePricePlan;
