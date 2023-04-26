const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { UniversitiesList } = require("../../../models/UniversitiesList");
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
    const { file } = req;
    if (!file)
      return res.sendApiResponse({
        status: 400,
        message: "Please upload an image file.",
      });
    const uniqueName = getFileName(file.originalname);
    const uploadResult = await fileStorage.uploadFile(
      "images/" + uniqueName,
      file.buffer
    );
    let value = { image: uploadResult.Location };
    let universities = await new UniversitiesList(value).save();
    res.sendApiResponse({ data: universities });
  },
  fileExceptionHandler
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let universities = await UniversitiesList.findById(id);
  if (!universities)
    return res.sendApiResponse({
      status: 404,
      message: "University Img with this ID does not exist!",
    });
  res.sendApiResponse({ data: universities });
});

router.get("/", async (req, res) => {
  let universities = await UniversitiesList.find({}).sort("sortOrder");

  res.sendApiResponse({ data: universities });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return UniversitiesList.findByIdAndUpdate(id, { sortOrder: index });
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
    const { file } = req;
    if (!file)
      return res.sendApiResponse({
        status: 400,
        message: "Please upload an image file.",
      });
    const uniqueName = getFileName(file.originalname);
    const uploadResult = await fileStorage.uploadFile(
      "images/" + uniqueName,
      file.buffer
    );
    let value = { image: uniqueName };
    let universities = await UniversitiesList.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!universities)
      return res.sendApiResponse({
        status: 404,
        message: "University Img with this ID does not exist!",
      });
    res.sendApiResponse({ data: universities });
  },
  fileExceptionHandler
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let universities = await UniversitiesList.findByIdAndDelete(id);
  if (!universities)
    return res.sendApiResponse({
      status: 404,
      message: "University Img with this ID does not exist!",
    });
  res.sendApiResponse({ data: universities });
});

module.exports = router;
