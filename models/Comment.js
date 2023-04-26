const mongoose = require("mongoose");
const Joi = require("joi");

const commentModelSchema = new mongoose.Schema({
  comment: {
    type: String,
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
  },
  totalLikes: {
    type: mongoose.Schema.Types.ObjectId,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  replies: {
    type: [
      new mongoose.Schema({
        comment: {
          type: String,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "user",
        },
      }),
    ],
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "comment",
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

commentModelSchema.index({ content: 1, isDeleted: 1 });
const Comment = mongoose.model("comment", commentModelSchema);

function validateComment(comment) {
  const schema = Joi.object({
    comment: Joi.string().min(1).required(),
    content: Joi.objectId().required(),
  });

  return schema.validate(comment);
}

function validateReply(reply) {
  const schema = Joi.object({
    comment: Joi.string().min(1).required(),
    commentId: Joi.objectId().required(),
    replyingTo: Joi.objectId().allow("").optional(),
  });

  return schema.validate(reply);
}

module.exports = {
  Comment,
  validateComment,
  validateReply,
};
