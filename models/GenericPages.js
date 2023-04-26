const Joi = require("joi");
const mongoose = require("mongoose");

const genericPagesSchema = mongoose.Schema({
  title: {
    type: String,
  },

  slug: {
    type: String,
    default: "",
  },

  content: {
    type: String,
    default: "",
  },

  image: {
    type: String,
    default: "",
  },

  type: {
    type: String,
    default: "page",
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blogcategory",
  },

  isActive: {
    type: Boolean,
    default: true,
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

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },

  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const GenreicPages = mongoose.model("genericpages", genericPagesSchema);

function validateGenreicPages(genreicPage) {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
    slug: Joi.string().trim().required(),
    content: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    category: Joi.string().optional().allow(""),
    isActive: Joi.boolean().required(),
    metaTitle: Joi.string().trim().required(),
    metaDescription: Joi.string().trim().required(),
    metaKeyWords: Joi.string().trim().required(),
  });
  return schema.validate(genreicPage, { allowUnknown: true });
}

function validateGenreicPagesUponUpdate(genreicPage) {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
    slug: Joi.string().trim().required(),
    content: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    category: Joi.string().optional().allow(""),
    isActive: Joi.boolean().required(),
    metaTitle: Joi.string().trim().required(),
    metaDescription: Joi.string().trim().required(),
    metaKeyWords: Joi.string().trim().required(),
  });
  return schema.validate(genreicPage, { allowUnknown: true });
}

exports.GenreicPages = GenreicPages;
exports.validateGenreicPages = validateGenreicPages;
exports.validateGenreicPagesUponUpdate = validateGenreicPagesUponUpdate;
