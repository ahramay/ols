const mongoose = require("mongoose");
const Joi = require("joi");

const CHECKOUT_METHODS = {
  CASH_COLLECTION: "CASH_COLLECTION",
  PAYPRO: "PAYPRO",
  BANK_ALFALAH: "BANK_ALFALAH",
};
const checkoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    index: true,
  },

  method: {
    type: String,
    default: "",
  },

  safepayPaymentDetail: {
    type: new mongoose.Schema({
      tracker: {
        type: String,
      },
      signature: { type: String },
      token: { type: String },
      amount: { type: String },
      currency: { type: String },
      reference: { type: String },
      client: { type: String },
      created_at: { type: String },
      fees: { type: String },
      net: { type: String },
      user: { type: String },
      updated_at: { type: String },
    }),
  },

  cashCollectionDetail: {
    type: new mongoose.Schema({
      firstName: {
        type: String,
      },
      lastName: {
        type: String,
      },
      address: {
        type: String,
      },
      address2: {
        type: String,
      },
      city: {
        type: String,
      },
      country: {
        type: String,
      },
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
      otherInstructions: {
        type: String,
      },
      bykeyaBookingId: {
        type: String,
      },
      bykeyaBookingNo: {
        type: String,
      },
    }),
  },
  cashCollectionInitiated: {
    type: Boolean,
    default: false,
  },

  payproPaymentDetails: {
    type: new mongoose.Schema({
      name: {
        type: String,
      },
      address: {
        type: String,
      },

      phone: {
        type: String,
      },
      email: {
        type: String,
      },
    }),
  },

  bankAlfalahDetails: {
    type: new mongoose.Schema({
      orderId: {
        type: String,
        default: "",
      },
    }),
  },
  payproDetails: {
    type: Object,
    default: {},
  },
  paymentReciptImage: {
    type: String,
    default: "",
  },
  items: {
    type: [Object],
  },

  totalAmount: {
    type: Number,
    default: 0,
  },

  amountPayed: {
    type: Number,
    default: 0,
  },

  couponApplied: {
    type: String,
  },

  paymentDone: {
    type: Boolean,
    default: false,
  },

  checkoutCompleted: {
    type: Boolean,
    default: false,
  },

  refunded: {
    type: Boolean,
    default: false,
  },

  courseEnroled: {
    type: Boolean,
    default: false,
  },

  expiryNotificationDate: {
    type: Number,
  },
  expiryNotified: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Checkout = mongoose.model("checkout", checkoutSchema);

function validateCashCollectionCheckout(data) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    address: Joi.string().required(),
    address2: Joi.string().optional().allow(""),
    city: Joi.string().required(),
    country: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    otherInstructions: Joi.string().optional().allow(""),
  });
  return schema.validate(data);
}

function validateSafepayCheckout(data) {
  const schema = Joi.object({
    tracker: Joi.string().required(),
    signature: Joi.string().required(),
    token: Joi.string().required(),
    amount: Joi.number.required(),
    currency: Joi.string().required(),
    reference: Joi.string().required(),
    client: Joi.string().required(),
    created_at: Joi.string().required(),
    fees: Joi.number.required(),
    net: Joi.number.required(),
    user: Joi.string().required(),
    updated_at: Joi.string().required(),
  });
  return schema.validate(data);
}

module.exports = {
  Checkout,
  CHECKOUT_METHODS,
  validateCashCollectionCheckout,
  validateSafepayCheckout,
};
