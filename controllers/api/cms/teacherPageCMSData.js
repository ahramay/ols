const express = require("express");
const router = express.Router();
const {
  TeacherPageCMSData,
  validateTeacherPageCMSData,
} = require("../../../models/TeacherPageCMSData");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");

const { ADMIN } = userRoles;

router.get("/", async (req, res) => {
  let homePageCmsData = await TeacherPageCMSData.findOne({});

  if (!homePageCmsData)
    homePageCmsData = await new TeacherPageCMSData({}).save();
  res.send({ data: homePageCmsData });
});

router.put("/", authorize(ADMIN), async (req, res) => {
  const { error, value } = validateTeacherPageCMSData(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let homePageCmsData = await TeacherPageCMSData.findOneAndUpdate({}, value, {
    new: true,
  });
  if (!homePageCmsData)
    homePageCmsData = await new TeacherPageCMSData(value).save();
  res.sendApiResponse({ data: homePageCmsData });
});

module.exports = router;
