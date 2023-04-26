const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  WhyOutClassInfoCard,
  validateWhyOutClassInfoCard,
} = require("../../../models/WhyOutClassInfoCards");
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
    const { error, value } = validateWhyOutClassInfoCard(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });
    const uploadResult = await fileStorage.uploadFile(
      "images/cms/" + uniqueName,
      file.buffer
    );
    value.image = uniqueName;
    let infoCard = await new WhyOutClassInfoCard(value).save();
    res.sendApiResponse({ data: infoCard });
  },
  fileExceptionHandler
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let infoCard = await WhyOutClassInfoCard.findById(id);
  if (!infoCard)
    return res.sendApiResponse({
      status: 404,
      message: "WhyOutClass Info Card with this ID does not exist!",
    });
  res.sendApiResponse({ data: infoCard });
});

router.get("/", async (req, res) => {
  let infoCard = await WhyOutClassInfoCard.find({}).sort("sortOrder");

  res.sendApiResponse({ data: infoCard });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return WhyOutClassInfoCard.findByIdAndUpdate(id, { sortOrder: index });
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
    const { error, value } = validateWhyOutClassInfoCard(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });
    if (file) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/cms/" + uniqueName,
        file.buffer
      );
      value.image = uniqueName;
    }
    let infoCard = await WhyOutClassInfoCard.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!infoCard)
      return res.sendApiResponse({
        status: 404,
        message: "WhyOutClass Info Card with this ID does not exist!",
      });
    res.sendApiResponse({ data: infoCard });
  },
  fileExceptionHandler
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let infoCard = await WhyOutClassInfoCard.findByIdAndDelete(id);
  if (!infoCard)
    return res.sendApiResponse({
      status: 404,
      message: "WhyOutClass Info Card with this ID does not exist!",
    });
  res.sendApiResponse({ data: infoCard });
});

module.exports = router;
