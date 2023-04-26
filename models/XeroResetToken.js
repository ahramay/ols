const mongoose = require("mongoose");

const xeroResetTokenSchema = mongoose.Schema({
  token: {
    type: String,
    default: "",
  },
});

const XeroResetToken = mongoose.model("xeroresettoken", xeroResetTokenSchema);

exports.XeroResetToken = XeroResetToken;
