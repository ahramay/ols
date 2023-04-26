const mongoose = require("mongoose");
const Joi = require("joi");

const blogCategorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blogcategory",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const BlogCategory = mongoose.model("blogcategory", blogCategorySchema);

function validateBlogCategory(data) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    parent: Joi.objectId().optional().allow(""),
  });
  return schema.validate(data);
}

async function getAllParentBlogCategories(id) {
  const categoryTree = [];

  let category = await BlogCategory.findOne({ _id: id, isDeleted: false });
  if (!category) return categoryTree.reverse();
  categoryTree.push(category);
  while (category.parent) {
    category = await Category.findOne({
      isDeleted: false,
      _id: category.parent,
    });
    if (!category) break;
    categoryTree.push(category);
  }
  return categoryTree.reverse();
}

module.exports = {
  BlogCategory,
  validateBlogCategory,
  getAllParentBlogCategories,
};
