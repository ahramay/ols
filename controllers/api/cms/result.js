const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");
const { Result, validateResult } = require("../../../models/Result");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.post(
  "/",
  authorize(ADMIN),
  imageUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  async (req, res) => {
    const { files } = req;

    if (files.banner) {
      const uniqueName = getFileName(files.banner[0].originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        files.banner[0].buffer
      );
      var banner = uploadResult.Location;
    }
    if (files.image) {
      const uniqueName = getFileName(files.image[0].originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        files.image[0].buffer
      );
      var image = uploadResult.Location;
    }
    let result = await new Result({ banner, image }).save();
    res.sendApiResponse({ data: result });
  },
  fileExceptionHandler
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let result = await Result.findById(id);
  if (!result)
    return res.sendApiResponse({
      status: 404,
      message: "Result with this ID does not exist!",
    });
  res.sendApiResponse({ data: result });
});

router.get("/", async (req, res) => {
  let result = await Result.find({}).sort("sortOrder");
  res.sendApiResponse({ data: result });
});

router.put(
  "/:id",
  authorize(ADMIN),
  imageUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    const { files } = req;

    if (files.banner) {
      const uniqueName = getFileName(files.banner[0].originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        files.banner[0].buffer
      );
      var banner = uploadResult.Location;
    }
    if (files.image) {
      const uniqueName = getFileName(files.image[0].originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        files.image[0].buffer
      );
      var image = uploadResult.Location;
    }
    let result = await Result.findByIdAndUpdate(
      id,
      { banner, image },
      { new: true }
    );
    if (!result)
      return res.sendApiResponse({
        status: 404,
        message: "Result with this ID does not exist!",
      });
    res.sendApiResponse({ data: result });
  }
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let result = await Result.findByIdAndDelete(id);
  if (!result)
    return res.sendApiResponse({
      status: 404,
      message: "Result with this ID does not exist!",
    });
  res.sendApiResponse({ data: result });
});

module.exports = router;
