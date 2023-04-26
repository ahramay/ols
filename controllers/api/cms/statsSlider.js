const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  StatsSlider,
  validateStatsSlider,
} = require("../../../models/StatsSlider");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.post("/", authorize(ADMIN), async (req, res) => {
  const { error, value } = validateStatsSlider(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let stats = await new StatsSlider(value).save();
  res.sendApiResponse({ data: stats });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let stats = await StatsSlider.findById(id);
  if (!stats)
    return res.sendApiResponse({
      status: 404,
      message: "Stats Slider with this ID does not exist!",
    });
  res.sendApiResponse({ data: stats });
});

router.get("/", async (req, res) => {
  let stats = await StatsSlider.find({}).sort("sortOrder");

  res.sendApiResponse({ data: stats });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return StatsSlider.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ message: "Successfully Sorted!" });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  const { error, value } = validateStatsSlider(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let stats = await StatsSlider.findByIdAndUpdate(id, value, {
    new: true,
  });
  if (!stats)
    return res.sendApiResponse({
      status: 404,
      message: "Stats Slider with this ID does not exist!",
    });
  res.sendApiResponse({ data: stats });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let stats = await StatsSlider.findByIdAndDelete(id);
  if (!stats)
    return res.sendApiResponse({
      status: 404,
      message: "Stats Slider with this ID does not exist!",
    });
  res.sendApiResponse({ data: stats });
});

module.exports = router;
