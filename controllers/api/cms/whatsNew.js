const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");
const { WhatsNew, validateWhatsNew } = require("../../../models/WhatsNew");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.post(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;

    const { error, value } = validateWhatsNew(body);
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
    let responseData = await new WhatsNew(value).save();
    res.sendApiResponse({ data: responseData });
  },
  fileExceptionHandler
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let responseData = await WhatsNew.findById(id);
  if (!responseData)
    return res.sendApiResponse({
      status: 404,
      message: "Course with this ID does not exist!",
    });
  res.sendApiResponse({ data: responseData });
});

router.get("/", async (req, res) => {
  let responseData = await WhatsNew.find({}).sort("sortOrder");
  res.sendApiResponse({ data: responseData });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return WhatsNew.findByIdAndUpdate(id, { sortOrder: index });
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
    const { error, value } = validateWhatsNew(body);
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
    let responseData = await WhatsNew.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!responseData)
      return res.sendApiResponse({
        status: 404,
        message: "Courae with this ID does not exist!",
      });
    res.sendApiResponse({ data: responseData });
  }
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let responseData = await WhatsNew.findByIdAndDelete(id);
  if (!responseData)
    return res.sendApiResponse({
      status: 404,
      message: "Courae with this ID does not exist!",
    });
  res.sendApiResponse({ data: responseData });
});

module.exports = router;
