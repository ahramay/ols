const mongoose = require("mongoose");
const Joi = require("joi");

const notificationSchema = mongoose.Schema({
  title: {
    type: String,
  },
  desc: {
    type: String,
  },
  link: {
    type: String,
  },
  category: {
    type: String,
  },
  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  created: {
    type: Date,
    default: Date.now(),
  },
});

const Notification = mongoose.model("notification", notificationSchema);

exports.Notification = Notification;

module.exports.validateNotification = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    desc: Joi.string().required(),
    link: Joi.string().required(),
    category: Joi.string().required(),
  });
  return schema.validate(data);
};
