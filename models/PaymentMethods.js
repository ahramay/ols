const Joi = require("joi");
const mongoose = require("mongoose");

const paymentMethodsSchema = mongoose.Schema({
  paymentType: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

const PaymentMethods = mongoose.model("PaymentMethods", paymentMethodsSchema);

function validatePaymentMethods(payment) {
  const schema = Joi.object({
    paymentType: Joi.string(),
    description: Joi.string(),
  });
  return schema.validate(payment);
}

exports.PaymentMethods = PaymentMethods;
exports.validatePaymentMethods = validatePaymentMethods;
