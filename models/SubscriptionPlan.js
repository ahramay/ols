const Joi = require("joi");
const mongoose = require("mongoose");

const subscriptionPlanSchema = mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  name: {
    type: String,
    default: "",
    required: true,
  },
  numberOfCourses: {
    type: Number,
    required: true,
  },
  cardImage: {
    type: String,
    default: "",
  },
  smallImage: {
    type: String,
    default: "",
  },

  chooseText: {
    type: String,
    default: "",
  },
  accessibleText: {
    type: String,
    default: "",
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

const SubscriptionPlan = mongoose.model(
  "subscriptionplan",
  subscriptionPlanSchema
);

function validateSubscriptionPlan(data) {
  const schema = Joi.object({
    category: Joi.objectId().required(),
    name: Joi.string().required(),
    numberOfCourses: Joi.number().required(),
    // accessibleText: Joi.string().required(),
    chooseText: Joi.string().required(),
  });
  return schema.validate(data);
}

exports.SubscriptionPlan = SubscriptionPlan;
exports.validateSubscriptionPlan = validateSubscriptionPlan;
