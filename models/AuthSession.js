const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const authSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  createdAt: {
    type: Date,
  },
  isExpired: {
    type: Boolean,
    default: false,
  },
  expiredAt: {
    type: Date,
  },
});

authSessionSchema.methods.generateToken = function () {
  return jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
};

const AuthSession = mongoose.model("authsession", authSessionSchema);

module.exports.AuthSession = AuthSession;
