const mongoose = require("mongoose");
const Joi = require("joi");

const couponUsage = new mongoose.Schema({
  couponId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "coupon",
  },
  code: {
    type: String,
    index: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "course",
  },

  validTill: {
    type: Number,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const CouponUsage = mongoose.model("couponusage", couponUsage);

module.exports = {
  CouponUsage,
};
