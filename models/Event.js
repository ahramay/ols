const Joi = require("joi");
const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  name: {
    type: String,
    default: "",
  },

  description: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    default: "event",
  },

  venue: {
    type: String,
    default: "",
  },

  startDate: {
    type: Number,
  },

  endDate: {
    type: Number,
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

const Event = mongoose.model("event", eventSchema);

function validateEvent(message) {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    type: Joi.string().required(),
    venue: Joi.string().optional().allow(""),
    startDate: Joi.number().min(0).required(),
    endDate: Joi.number().min(0).required(),
  });
  return schema.validate(message);
}

exports.Event = Event;
exports.validateEvent = validateEvent;
