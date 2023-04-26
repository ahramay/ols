const express = require("express");
const router = express.Router();
const { authorize } = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");
const { Level, validateLevel } = require("../../models/Level");
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
  const queryObj = Level.find(query)

    .skip(parseInt(start))
    .limit(parseInt(length))
    .sort("-_id");

  const data = await queryObj;

  const recordsFiltered = await Level.find(query).count();
  const recordsTotal = await Level.find({ isDeleted: false }).count();

  const languages = {
    draw,
    recordsTotal,
    recordsFiltered,
    data,
  };
  res.send(languages);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Language Id" });
  const language = await Level.findById(id);
  if (!language)
    return res.sendApiResponse({ status: 404, message: "Language not found" });
  res.sendApiResponse({ data: language });
});

router.get("/", async (req, res) => {
  const language = await Level.find({ isDeleted: false });
  res.sendApiResponse({ data: language });
});

router.post("/", authorize(ADMIN), async (req, res) => {
  const { value, error } = validateLevel(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const language = await new Level(value).save();
  res.sendApiResponse({ data: language });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Language Id" });

  const {
    value: { name, parent },
    error,
  } = validateLevel(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  const data = { name, parent };
  if (!parent) data.parent = null;

  const language = await Level.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );

  if (!language)
    return res.sendApiResponse({ status: 404, message: "Language not found!" });

  res.sendApiResponse({ data: language });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Language Id" });

  const language = await Level.findByIdAndUpdate(
    id,
    {
      $set: { isDeleted: true },
    },
    { new: true }
  );

  if (!language)
    return res.sendApiResponse({ status: 404, message: "Language not found!" });

  res.sendApiResponse({ data: language });
});

module.exports = router;
