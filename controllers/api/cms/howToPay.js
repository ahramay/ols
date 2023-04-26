const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { HowToPay, validateHowToPay } = require("../../../models/HowToPay");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");

router.get("/", async (req, res) => {
  let homeJoin = await HowToPay.findOne({});
  if (!homeJoin) {
    homeJoin = await new HowToPay({
      heading: "Heading",
      text: "Text",
      buttonText: "Main Heading ",
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
    const { error, value } = validateHowToPay(body);
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

    console.log("VALUE => ", value);
    let homeJoin = await HowToPay.findOneAndUpdate({}, value, {
      new: true,
    });
    if (!homeJoin) {
      homeJoin = await new HowToPay(value).save();
    }
    res.sendApiResponse({ data: homeJoin });
  },
  fileExceptionHandler
);

module.exports = router;
