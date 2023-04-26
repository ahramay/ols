const express = require("express");
const router = express.Router();
const { authorize } = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");
const {
  BlogCategory,
  validateBlogCategory,
} = require("../../models/BlogCategory");
const { validateObjectId } = require("../../helpers/validation");

const { ADMIN } = userRoles;

router.get("/data_table", authorize(ADMIN), async (req, res) => {
  const {
    draw = "1",
    search = { value: "" },
    start = 0,
    length = 10,
    order = [0, "_id"],
  } = req.query;

  const query = {
    isDeleted: false,
  };

  search.value = search.value.trim();

  if (search.value !== "") {
    const searchExp = RegExp(`.*${search.value}.*`, "i");
    query.name = searchExp;
  }

  const orderColumn = "createdAt";
  const sortBy = {};
  if (order[0] === parseInt(0) && order[1] === "_id") {
    sortBy[orderColumn] = -1;
  }
  const queryObj = BlogCategory.find(query)

    .skip(parseInt(start))
    .limit(parseInt(length))
    .populate("parent")
    .sort("-_id");

  const data = await queryObj;

  const recordsFiltered = await BlogCategory.find(query).count();
  const recordsTotal = await BlogCategory.find({ isDeleted: false }).count();

  const categories = {
    draw,
    recordsTotal,
    recordsFiltered,
    data,
  };
  res.send(categories);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid category Id" });
  const category = await BlogCategory.findById(id);
  if (!category)
    return res.sendApiResponse({ status: 404, message: "Category not found" });
  res.sendApiResponse({ data: category });
});

router.get("/", async (req, res) => {
  const categories = await BlogCategory.find({ isDeleted: false }).sort("name");
  res.sendApiResponse({ data: categories });
});

router.post("/", authorize(ADMIN), async (req, res) => {
  const {
    value: { name, parent },
    error,
  } = validateBlogCategory(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const data = { name };
  if (parent) data.parent = parent;
  const category = await new BlogCategory(data).save();
  res.sendApiResponse({ data: category });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid category Id" });

  const {
    value: { name, parent },
    error,
  } = validateBlogCategory(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  const data = { name, parent };
  if (!parent) data.parent = null;

  const category = await BlogCategory.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );

  if (!category)
    return res.sendApiResponse({ status: 404, message: "Category not found!" });

  res.sendApiResponse({ data: category });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid category Id" });

  const category = await BlogCategory.findByIdAndUpdate(
    id,
    {
      $set: { isDeleted: true },
    },
    { new: true }
  );

  if (!category)
    return res.sendApiResponse({ status: 404, message: "Category not found!" });

  res.sendApiResponse({ data: category });
});

module.exports = router;
