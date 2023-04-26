const express = require("express");
const router = express.Router();
const {
  FreeVideosPageCMSData,
  validateFreeVideosPageCMSData,
} = require("../../../models/FreeVideosPageCMSData");


const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");

const { ADMIN } = userRoles;

router.get("/", async (req, res) => {
  let freeVideosPageCmsData = await FreeVideosPageCMSData.findOne({});

  if (!freeVideosPageCmsData) freeVideosPageCmsData = await new FreeVideosPageCMSData({}).save();
  res.send({ data: freeVideosPageCmsData });
});

router.put("/", authorize(ADMIN), async (req, res) => {
  const { error, value } = validateFreeVideosPageCMSData(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let freeVideosPageCmsData = await FreeVideosPageCMSData.findOneAndUpdate({}, value, {
    new: true,
  });
  if (!freeVideosPageCmsData)
    freeVideosPageCmsData = await new FreeVideosPageCMSData(value).save();
  res.sendApiResponse({ data: freeVideosPageCmsData });
});

module.exports = router;
