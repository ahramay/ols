const mongoose = require("mongoose");
const Joi = require("joi");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    index: true,
  },

  discountType: {
    type: String,
  },

  discount: {
    type: Number,
  },
  referalEmails: {
    type: String,
  },

  applicableTo: {
    type: String,
  },
  categories: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "category",
  },

  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "course",
  },

  reusability: {
    type: String,
  },

  reusabilityCount: {
    type: String,
  },
  validFrom: {
    type: Date,
  },
  validTill: {
    type: Number,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

function validateCoupon(input) {
  const schema = Joi.object({
    code: Joi.string().min(1).trim().required(),
    discountType: Joi.string().max(30).trim().required(),
    discount: Joi.number().min(0).required(),
    applicableTo: Joi.string().max(30).trim().required(),
    courses: Joi.array().items(Joi.objectId()).min(0).required(),
    categories: Joi.array().items(Joi.objectId()).min(0).required(),
    referalEmails: Joi.string().optional().trim().allow(""),
    reusability: Joi.string().min(5).max(30).optional(),
    reusabilityCount: Joi.number().min(0).optional().allow(""),
    validTill: Joi.string().min(0).required(),
    isActive: Joi.boolean().required(),
  });
  return schema.validate(input);
}

const Coupon = mongoose.model("coupon", couponSchema);

module.exports = {
  Coupon,
  validateCoupon,
};
