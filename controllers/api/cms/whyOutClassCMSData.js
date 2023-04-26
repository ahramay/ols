const express = require("express");
const router = express.Router();
const {
  WhyOutClassCMSData,
  validateWhyOutClassCMSData,
} = require("../../../models/WhyOutClassCMSData");
const { InfoCard } = require("../../../models/InfoCards");
const { WhyOutClassList } = require("../../../models/WhyOutClassList");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.get("/", async (req, res) => {
  let whyoutclassCMSData = await WhyOutClassCMSData.findOne({});

  if (!whyoutclassCMSData)
    whyoutclassCMSData = await new WhyOutClassCMSData({
      mainHeading: "#",
      subText1: "#",
      subText1Link: "#",
      subText2: "#",
      heading1: "#",
      text1: "#",
      heading2: "#",
      heading3: "#",
      metaTitle: "#",
      metaDescription: "#",
      metaKeyWords: "#",
    }).save();

  res.sendApiResponse({ data: whyoutclassCMSData });
});

router.put("/", authorize(ADMIN), async (req, res) => {
  const { error, value } = validateWhyOutClassCMSData(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let whyoutclassCMSData = await WhyOutClassCMSData.findOneAndUpdate(
    {},
    value,
    {
      new: true,
    }
  );

  res.sendApiResponse({ data: whyoutclassCMSData });
});

module.exports = router;
