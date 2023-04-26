const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");
const {
  PopularCourse,
  validatePopularCourse,
} = require("../../../models/PopularCourse");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.post(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;

    const { error, value } = validatePopularCourse(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });
    if (file) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );
      value.image = uploadResult.Location;
    }
    let popularCourse = await new PopularCourse(value).save();
    res.sendApiResponse({ data: popularCourse });
  },
  fileExceptionHandler
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let popularCourse = await PopularCourse.findById(id);
  if (!popularCourse)
    return res.sendApiResponse({
      status: 404,
      message: "Course with this ID does not exist!",
    });
  res.sendApiResponse({ data: popularCourse });
});

router.get("/", async (req, res) => {
  let popularCourse = await PopularCourse.find({}).sort("sortOrder");
  res.sendApiResponse({ data: popularCourse });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return PopularCourse.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ message: "Successfully Sorted!" });
});

router.put(
  "/:id",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    const { file, body } = req;
    const { error, value } = validatePopularCourse(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });
    if (file) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );
      value.image = uploadResult.Location;
    }
    let popularCourse = await PopularCourse.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!popularCourse)
      return res.sendApiResponse({
        status: 404,
        message: "Courae with this ID does not exist!",
      });
    res.sendApiResponse({ data: popularCourse });
  }
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let popularCourse = await PopularCourse.findByIdAndDelete(id);
  if (!popularCourse)
    return res.sendApiResponse({
      status: 404,
      message: "Courae with this ID does not exist!",
    });
  res.sendApiResponse({ data: popularCourse });
});

module.exports = router;
