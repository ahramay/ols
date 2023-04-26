const express = require("express");
const router = express.Router();
const {
  CommonSiteData,
  validateCommonSiteData,
} = require("../../../models/CommonSiteData");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;
const { getFileName } = require("../../../helpers/file");
const { imageUpload, documentUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");

router.get("/", async (req, res) => {
  let commonSiteData = await CommonSiteData.findOne({});
  if (!commonSiteData) {
    commonSiteData = await new CommonSiteData({
      contactNumber: "+923000000000",
      facebookLink: "#",
      linkedInLink: "#",
      twitterLink: "#",
      instagramLink: "#",
    });
  }

  res.sendApiResponse({ data: commonSiteData });
});

router.put(
  "/",
  authorize(ADMIN),
  imageUpload.single("logo"),
  async (req, res) => {
    const { file, body } = req;
    const { error, value } = validateCommonSiteData(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });
    if (file) {
      const uniqueName = getFileName(file.originalname);
      const uploadRes = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );
      value.logo = uploadRes.Location;
    }
    let commonSiteData = await CommonSiteData.findOneAndUpdate(
      {},
      { $set: value },
      {
        new: true,
      }
    );
    if (!commonSiteData) {
      commonSiteData = await new CommonSiteData(value).save();
    }

    res.sendApiResponse({ data: commonSiteData });
  }
);

router.put(
  "/upload_robot_txt",
  documentUpload.single("robot"),
  async (req, res) => {
    const { file } = req;
    if (!file)
      return res.sendApiResponse({
        status: 400,
        message: "robot.txt is required",
      });

    // const uniqueName = getFileName(file.originalname);
    const uploadRes = await fileStorage.uploadFile(
      "documents/robot.txt",
      file.buffer
    );

    let commonSiteData = await CommonSiteData.findOneAndUpdate(
      {},
      { robotTxt: uploadRes.Location },
      {
        new: true,
      }
    );

    console.log("common => ", commonSiteData);

    res.sendApiResponse({ message: "File Uploaded" });
  },
  fileExceptionHandler
);

router.put(
  "/login_model_image",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    if (!req.file)
      return res.sendApiResponse({ status: 400, message: "Image is required" });

    const { file } = req;
    const uniqueName = getFileName(file.originalname);
    const uploadRes = await fileStorage.uploadFile(
      "images/" + uniqueName,
      file.buffer
    );
    let commonSiteData = await CommonSiteData.findOneAndUpdate(
      {},
      { $set: { loginModalImage: uploadRes.Location } },
      {
        new: true,
      }
    );

    res.sendApiResponse({ message: "Login Modal Image updated" });
  }
);

router.put(
  "/register_model_image",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    if (!req.file)
      return res.sendApiResponse({ status: 400, message: "Image is required" });
    const { file } = req;
    const uniqueName = getFileName(file.originalname);
    const uploadRes = await fileStorage.uploadFile(
      "images/" + uniqueName,
      file.buffer
    );
    let commonSiteData = await CommonSiteData.findOneAndUpdate(
      {},
      { $set: { registerModalImage: uploadRes.Location } },
      {
        new: true,
      }
    );

    res.sendApiResponse({ message: "Register Modal Image updated" });
  }
);

module.exports = router;
