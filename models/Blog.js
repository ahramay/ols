const Joi = require("joi");
const mongoose = require("mongoose");

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    default: "",
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
    default: "blog",
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
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Blog = mongoose.model("blog", blogSchema);

function validateBlog(genreicPage) {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
    content: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    isActive: Joi.boolean().required(),
    metaTitle: Joi.string().trim().required(),
    metaDescription: Joi.string().trim().required(),
    metaKeyWords: Joi.string().trim().required(),
  });
  return schema.validate(genreicPage, { allowUnknown: true });
}

function validateBlogUponUpdate(genreicPage) {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
    content: Joi.string().trim().required(),
    category: Joi.string().trim().required(),
    type: Joi.string().trim().required(),
    isActive: Joi.boolean().required(),
    metaTitle: Joi.string().trim().required(),
    metaDescription: Joi.string().trim().required(),
    metaKeyWords: Joi.string().trim().required(),
  });
  return schema.validate(genreicPage, { allowUnknown: true });
}

exports.Blog = Blog;
exports.validateBlog = validateBlog;
exports.validateBlogUponUpdate = validateBlogUponUpdate;
