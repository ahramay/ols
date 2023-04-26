const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");
const {
  StudyMaterial,
  validateStudyMaterial,
} = require("../../../models/StudyMaterial");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.post(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;

    const { error, value } = validateStudyMaterial(body);
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
    let studyMaterial = await new StudyMaterial(value).save();
    res.sendApiResponse({ data: studyMaterial });
  },
  fileExceptionHandler
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let studyMaterial = await StudyMaterial.findById(id);
  if (!studyMaterial)
    return res.sendApiResponse({
      status: 404,
      message: "Study Material with this ID does not exist!",
    });
  res.sendApiResponse({ data: studyMaterial });
});

router.get("/", async (req, res) => {
  let studyMaterials = await StudyMaterial.find({}).sort("sortOrder");
  res.sendApiResponse({ data: studyMaterials });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return StudyMaterial.findByIdAndUpdate(id, { sortOrder: index });
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
    const { error, value } = validateStudyMaterial(body);
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
    let studyMaterial = await StudyMaterial.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!studyMaterial)
      return res.sendApiResponse({
        status: 404,
        message: "Study Material with this ID does not exist!",
      });
    res.sendApiResponse({ data: studyMaterial });
  }
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let studyMaterial = await StudyMaterial.findByIdAndDelete(id);
  if (!studyMaterial)
    return res.sendApiResponse({
      status: 404,
      message: "Study Material with this ID does not exist!",
    });
  res.sendApiResponse({ data: studyMaterial });
});

module.exports = router;
