const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  HomeMiddle,
  validateHomeMiddle,
} = require("../../../models/HomeMiddleCMSPage");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");

router.get("/", async (req, res) => {
  let homeMiddle = await HomeMiddle.findOne({});
  if (!homeMiddle) {
    homeMiddle = await new HomeMiddle({
      heading1: "Heading",
      text1: "Text",
      heading2: "Heading",
      text2: "Text",
      heading3: "Heading",
      text3: "Text",
      heading4: "Heading",
      text4: "Text",
      heading5: "Heading",
      text5: "Text",
      heading6: "Heading",
      text6: "Text",
      heading7: "Heading",
      text7: "Text",
      heading8: "Heading",
      text8: "Text",
    }).save();
  }
  res.sendApiResponse({ data: homeMiddle });
});

router.put(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;
    var { error, value } = validateHomeMiddle(body);
    if (error) {
      res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });
    }

    if (file && value.heading1) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );
      value.image = uploadResult.Location;
    } else if (file && value.heading2) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );

      value.image2 = uploadResult.Location;
    } else if (file && value.heading3) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );
      value.image3 = uploadResult.Location;
    } else if (file && value.heading4) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );

      value.image4 = uploadResult.Location;
    } else if (file && value.heading5) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );
      value.image5 = uploadResult.Location;
    } else if (file && value.heading6) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );
      value.image6 = uploadResult.Location;
    } else if (file && value.heading7) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );
      value.image7 = uploadResult.Location;
    } else if (file && value.heading8) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );
      value.image8 = uploadResult.Location;
    }
    console.log("=====>", value);
    let homeMiddle = await HomeMiddle.findOneAndUpdate({}, value, {
      new: true,
    });
    if (!homeMiddle) {
      homeMiddle = await new HomeMiddle.create(value);
    }
    return res.sendApiResponse({ data: homeMiddle });
  }
);

module.exports = router;
