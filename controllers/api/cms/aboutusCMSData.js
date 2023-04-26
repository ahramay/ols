const express = require("express");
const router = express.Router();
const {
  AboutUsCMSData,
  validateAboutUsCMSData,
} = require("../../../models/AboutUsCMSData");

const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");

const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");

const { ADMIN } = userRoles;

router.get("/", async (req, res) => {
  let aboutusCMSData = await AboutUsCMSData.findOne({});

  if (!aboutusCMSData)
    aboutusCMSData = await new AboutUsCMSData({
      mainHeading: "#",
      subText1: "#",
      subText1Link: "#",
      subText2: "#",
      heading1: "#",
      text1: "#",
      heading2: "#",
      image1: "",
      heading3: "#",
      metaTitle: "#",
      metaDescription: "#",
      metaKeyWords: "#",
    }).save();
  res.sendApiResponse({ data: aboutusCMSData });
});

router.put(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;
    console.log("REQ FILE =>", file);
    const { error, value } = validateAboutUsCMSData(body);
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
      console.log("UPLOAD RESULT =>>>>.", uploadResult);
      value.image1 = uploadResult.Location;
    }
    console.log("DATA TO SAVE +>>>>", value);
    let aboutusCMSData = await AboutUsCMSData.findOneAndUpdate({}, value, {
      new: true,
    });

    res.sendApiResponse({ data: aboutusCMSData });
  }
);

module.exports = router;
