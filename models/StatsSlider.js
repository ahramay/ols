const Joi = require("joi");
const mongoose = require("mongoose");

const statsSliderSchema = mongoose.Schema({
  stats: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

const StatsSlider = mongoose.model("StatsSlider", statsSliderSchema);

function validateStatsSlider(stats) {
  const schema = Joi.object({
    stats: Joi.string(),
    text: Joi.string(),
  });
  return schema.validate(stats);
}

exports.StatsSlider = StatsSlider;
exports.validateStatsSlider = validateStatsSlider;
