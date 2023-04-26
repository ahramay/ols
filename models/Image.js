const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");

const mediaPath = config.get("mediaPath");

const imageSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      get: (image) => {
        if (!image) return "";
        return mediaPath + `uploads/images/${image}`;
      },
    },
    content: {
      type: String,
      index: true,
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

const Image = mongoose.model("image", imageSchema);

module.exports = {
  Image,
};
