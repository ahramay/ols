const mongoose = require("mongoose");
const Joi = require("joi");

const watchedVideoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    index: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },

  lesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "lesson",
  },
});

const WatchedVideo = mongoose.model("watchedvideo", watchedVideoSchema);

function validateWatchedVideo(data) {
  const schema = Joi.object({
    course: Joi.string().min(1).max(50).required(),
    lesson: Joi.string().min(1).max(50).required(),
  });

  return schema.validate(data);
}

module.exports = {
  WatchedVideo,
  validateWatchedVideo,
};
