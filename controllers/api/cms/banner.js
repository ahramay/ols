const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Banner, validateBanner } = require("../../../models/Banner");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;
const { fileExceptionHandler } = require("../../../middlewares/errors");

router.post(
  "/",
  authorize(ADMIN),
  async (req, res) => {
    const { body } = req;

    const { error, value } = validateBanner(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    let addBanner = await new Banner(value).save();
    res.sendApiResponse({ data: addBanner });
  },
  fileExceptionHandler
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let foundBanner = await Banner.findById(id);
  if (!foundBanner)
    return res.sendApiResponse({
      status: 404,
      message: "Banner with this ID does not exist!",
    });
  res.sendApiResponse({ data: foundBanner });
});

router.get("/", async (req, res) => {
  let findBanner = await Banner.find({});
  res.sendApiResponse({ data: findBanner });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let deleteBanner = await Banner.findByIdAndDelete(id);
  if (!deleteBanner)
    return res.sendApiResponse({
      status: 404,
      message: "this is deleted",
    });
  res.sendApiResponse({ data: deleteBanner });
});

router.put(
  "/:id",
  authorize(ADMIN),
  async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    const { error, value } = validateBanner(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    let updateBanner = await Banner.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!updateBanner)
      return res.sendApiResponse({
        status: 404,
        message: "Banner with this ID does not exist!",
      });
    res.sendApiResponse({ data: updateBanner });
  },
  fileExceptionHandler
);

module.exports = router;
