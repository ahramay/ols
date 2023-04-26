const mongoose = require("mongoose");

const bankAlfalahSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  orderId: {
    type: String,
    default: "",
  },

  sessionId: {
    type: String,
    default: "",
    index: true,
  },

  successIndicator: {
    type: String,
  },
});

const BankAlfalahSession = mongoose.model(
  "bankalfalahsession",
  bankAlfalahSessionSchema
);

module.exports = {
  BankAlfalahSession,
};
