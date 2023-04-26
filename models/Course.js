const mongoose = require("mongoose");
const Joi = require("joi");
const config = require("config");

const mediaPath = config.get("mediaPath");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
  },

  slug: {
    type: String,
    default: "",
    index: true,
  },

  metaTitle: {
    type: String,
    default: "",
  },
  metaDescription: {
    type: String,
    default: "",
  },
  metaKeyWords: {
    type: String,
    default: "",
  },

  description: {
    type: String,
  },

  image: {
    type: String,
    // get: (image) => {
    //   if (!image) return "";
    //   return mediaPath + `uploads/images/${image}`;
    // },
  },

  price: {
    type: Number,
    default: 0,
  },

  // category is a sub document
  category: new mongoose.Schema({
    name: { type: String },
    _id: { type: mongoose.Schema.Types.ObjectId },
  }),

  instructors: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "user",
  },

  rating: {
    type: Number,
    default: 0,
  },

  totalRatingCount: {
    type: Number,
    default: 0,
  },

  ratingSum: {
    type: Number,
    default: 0,
  },

  rateCount: {
    type: Number,
    default: 0,
  },

  oneStar: {
    type: Number,
    default: 0,
  },

  twoStar: {
    type: Number,
    default: 0,
  },

  threeStar: {
    type: Number,
    default: 0,
  },

  fourStar: {
    type: Number,
    default: 0,
  },

  fiveStar: {
    type: Number,
    default: 0,
  },

  duration: {
    type: String,
  },

  videoDuration: {
    type: String,
  },

  lectures: {
    type: String,
  },

  skillLevel: new mongoose.Schema({
    name: { type: String },
    _id: { type: mongoose.Schema.Types.ObjectId },
  }),

  language: new mongoose.Schema({
    name: { type: String },
    _id: { type: mongoose.Schema.Types.ObjectId },
  }),

  buyCount: {
    type: Number,
    default: 0,
  },

  showReviews: {
    type: Boolean,
    default: false,
  },
  traits:{type:String},
  published: {
    type: Boolean,
    default: false,
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
});

function validateCreateCourse(input) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    category: Joi.objectId().required(),
    traits:Joi.string().required(),
  });
  return schema.validate(input);
}

function validateUpdateCourse(input) {
  const schema = Joi.object({
    name: Joi.string().min(1).required(),
    slug: Joi.string().min(1).required(),
    metaTitle: Joi.string().min(1).required(),
    metaDescription: Joi.string().min(1).required(),
    metaKeyWords: Joi.string().min(1).required(),
    description: Joi.string().min(1).required(),
    price: Joi.number().min(0).required(),
    category: Joi.objectId().required(),
    lectures: Joi.string().min(1).required(),
    duration: Joi.string().min(1).required(),
    videoDuration: Joi.string().min(1).required(),
    skillLevel: Joi.objectId().required(),
    traits:Joi.string().required(),
    language: Joi.objectId().required(),
    showReviews: Joi.boolean().required(),
    published: Joi.boolean().required(),
    instructors: Joi.array().items(Joi.objectId()).min(0).required(),
  });
  return schema.validate(input);
}

function validateInstructors(input) {
  const schema = Joi.object({
    instructors: Joi.array().items(Joi.objectId()).min(1).required(),
  });
  return schema.validate(input);
}

const Course = mongoose.model("course", courseSchema);

module.exports = {
  Course,
  validateCreateCourse,
  validateInstructors,
  validateUpdateCourse,
};
