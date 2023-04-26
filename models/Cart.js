const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    index: true,
  },

  coupon: {
    type: String,
    default: "",
  },
  withoutTax: {
    type: Number,
    default: 0,
  },
  withTax: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Cart = mongoose.model("cart", cartSchema);

module.exports = {
  Cart,
};
