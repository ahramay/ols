const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");
const { Fee, validateFee } = require("../../../models/Fee");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.get("/", async (req, res) => {
  let fee = await Fee.findOne({});
  if (!fee) {
    fee = await new Fee({ text: "Monthly Plans Start Form ..." }).save();
  }
  res.sendApiResponse({ data: fee });
});

router.put(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;
    const { error, value } = validateFee(body);
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
    let fee = await Fee.findOneAndUpdate({}, value, { new: true });

    res.sendApiResponse({ data: fee });
  }
);

module.exports = router;
