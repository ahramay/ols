const Joi = require("joi");
const mongoose = require("mongoose");

const forumMessageSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  thread: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "forumthread",
    index: true,
  },

  message: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ForumMessage = mongoose.model("forummessage", forumMessageSchema);

function validateForumMessage(message) {
  const schema = Joi.object({
    message: Joi.string().required(),
    thread: Joi.objectId().required(),
  });
  return schema.validate(message);
}

exports.ForumMessage = ForumMessage;
exports.validateForumMessage = validateForumMessage;
