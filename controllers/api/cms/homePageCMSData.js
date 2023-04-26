const express = require("express");
const router = express.Router();
const { User } = require("../../../models/User");
const {
  HomePageCMSData,
  validateHomePageCMSData,
} = require("../../../models/HomePageCmsData");
const { HomeHeaderSlider } = require("../../../models/HomeHeaderSlider");
const { InfoCard } = require("../../../models/InfoCards");
const {
  StudentReviewsSlider,
} = require("../../../models/StudentReviewsSlider");
const { StatsSlider } = require("../../../models/StatsSlider");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");

const { ADMIN } = userRoles;

router.get("/", async (req, res) => {
  let homePageCmsData = await HomePageCMSData.findOne({});
  const userCount = await User.find({}).count();
  if (!homePageCmsData) homePageCmsData = await new HomePageCMSData({}).save();
  res.send({ data: { ...homePageCmsData._doc, userCount } });
});

["img2"].forEach((key) => {
  router.put(
    `/${key}`,
    authorize(ADMIN),
    imageUpload.single("image"),
    async (req, res) => {
      const { file, body } = req;
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

      let subPlan = await HomePageCMSData.findOneAndUpdate(
        {},
        { $set: { [key]: uploadResult.Location } },
        {
          new: true,
        }
      );
      res.sendApiResponse({ data: subPlan });
    },

    fileExceptionHandler
  );
});

router.put("/", authorize(ADMIN), async (req, res) => {
  // console.log("comming",req.body);
  const { error, value } = validateHomePageCMSData(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  console.log(value);
  let homePageCmsData = await HomePageCMSData.findOneAndUpdate({}, value, {
    new: true,
  });
  if (!homePageCmsData)
    homePageCmsData = await new HomePageCMSData(value).save();
  res.sendApiResponse({ data: homePageCmsData });
});

module.exports = router;
