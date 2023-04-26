const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  WhyOutClassList,
  validateWhyOutClassList,
} = require("../../../models/WhyOutClassList");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");

router.post(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;
    if (!file)
      return res.sendApiResponse({
        status: 400,
        message: "Please upload an image file.",
      });
    const uniqueName = getFileName(file.originalname);
    const { error, value } = validateWhyOutClassList(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });
    const uploadResult = await fileStorage.uploadFile(
      "images/" + uniqueName,
      file.buffer
    );
    value.image = uploadResult.Location;
    let whyoutclassList = await new WhyOutClassList(value).save();
    res.sendApiResponse({ data: whyoutclassList });
  },
  fileExceptionHandler
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let whyoutclassList = await WhyOutClassList.findById(id);
  if (!whyoutclassList)
    return res.sendApiResponse({
      status: 404,
      message: "WhyOutClass List with this ID does not exist!",
    });
  res.sendApiResponse({ data: whyoutclassList });
});

router.get("/", async (req, res) => {
  let whyoutclassList = await WhyOutClassList.find({}).sort("sortOrder");

  res.sendApiResponse({ data: whyoutclassList });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return WhyOutClassList.findByIdAndUpdate(id, { sortOrder: index });
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
    const { file, body } = req;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    const { error, value } = validateWhyOutClassList(body);
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
    let whyoutclassList = await WhyOutClassList.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!whyoutclassList)
      return res.sendApiResponse({
        status: 404,
        message: "WhyOutClass List with this ID does not exist!",
      });
    res.sendApiResponse({ data: whyoutclassList });
  },
  fileExceptionHandler
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let whyoutclassList = await WhyOutClassList.findByIdAndDelete(id);
  if (!whyoutclassList)
    return res.sendApiResponse({
      status: 404,
      message: "WhyOutClass List with this ID does not exist!",
    });
  res.sendApiResponse({ data: whyoutclassList });
});

module.exports = router;
