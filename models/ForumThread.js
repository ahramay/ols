const Joi = require("joi");
const mongoose = require("mongoose");

const forumThreadSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
    index: true,
  },
  name: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    default: "question",
  },
  lastAnswer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "forummessage",
  },
  answers: {
    type: Number,
    default: 0,
  },

  ended: {
    type: Boolean,
    default: false,
  },

  endedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ForumThread = mongoose.model("forumthread", forumThreadSchema);

function validateForumThread(message) {
  const schema = Joi.object({
    course: Joi.objectId().required(),
    name: Joi.string().required(),
    type: Joi.string().required(),
  });
  return schema.validate(message);
}

exports.ForumThread = ForumThread;
exports.validateForumThread = validateForumThread;
