const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { HomeJoin, validateHomeJoin } = require("../../../models/HomeJoin");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");

router.get("/", async (req, res) => {
  let homeJoin = await HomeJoin.findOne({});
  if (!homeJoin) {
    homeJoin = await new HomeJoin({
      heading: "Heading",
      text: "Text",
      buttonText: "Button",
      buttonLink: "#",
    }).save();
  }
  res.sendApiResponse({ data: homeJoin });
});

router.put(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;
    const { error, value } = validateHomeJoin(body);
    if (error)
      res.sendApiResponse({
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
    let homeJoin = await HomeJoin.findOneAndUpdate({}, value, {
      new: true,
    });
    if (!homeJoin) {
      homeJoin = await new HomeJoin(value).save();
    }
    res.sendApiResponse({ data: homeJoin });
  },
  fileExceptionHandler
);

module.exports = router;
