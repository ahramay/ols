const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },
  free: {
    type: Boolean,
    default: false,
  },
  freeText: {
    type: String,
    default: "",
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

const Category = mongoose.model("category", categorySchema);

function validateCategory(data) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required(),
    parent: Joi.objectId().optional().allow(""),
    free: Joi.boolean().optional(),
    freeText: Joi.string().optional().allow(""),
  });
  return schema.validate(data);
}

async function getAllParentCategories(id) {
  const categoryTree = [];

  let category = await Category.findOne({ _id: id, isDeleted: false });
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
  Category,
  validateCategory,
  getAllParentCategories,
};
