const mongoose = require("mongoose");
const Joi = require("joi");

const freeVideoSchema = new mongoose.Schema(
  {
    videoTitle: {
      type: String,
      default: "",
    },
    videoLink: {
      type: String,
      default: "",
    },
    videoId: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },

    thumbnail: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },

    published: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    toObject: { getters: true, setters: true },
    toJSON: { getters: true, setters: true },
    runSettersOnQuery: true,
  }
);

const FreeVideo = mongoose.model("freevideos", freeVideoSchema);

function validateCreateFreeVideo(data) {
  const schema = Joi.object({
    videoTitle: Joi.string().trim().min(1).required(),
    videoLink: Joi.string().trim().min(1).required(),
    description: Joi.string().min(1).required(),
    category: Joi.string().min(1).required(),
  });
  return schema.validate(data);
}

function validateUpdateFreeVideo(data) {
  const schema = Joi.object({
    videoTitle: Joi.string().trim().min(1).required(),
    videoLink: Joi.string().trim().min(1).required(),
    description: Joi.string().min(1).required(),
    category: Joi.string().min(1).required(),
  });
  return schema.validate(data);
}

module.exports = {
  FreeVideo,
  validateCreateFreeVideo,
  validateUpdateFreeVideo,
};
