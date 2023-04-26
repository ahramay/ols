const express = require("express");
const router = express.Router();
const _ = require("lodash");
const {
  ContactUsCMSData,
  validateContactUsCMSData,
} = require("../../../models/ContactUsCMSData");
const { ContactUsInfoCard } = require("../../../models/ContactUsInfoCards");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.get("/", async (req, res) => {
  let contactUsCMSData = await ContactUsCMSData.findOne({});

  if (!contactUsCMSData)
    contactUsCMSData = await new ContactUsCMSData({
      mainHeading: "#",
      heading1: "#",
      heading2: "#",
      metaTitle: "#",
      metaDescription: "#",
      metaKeyWords: "#",
    }).save();
  res.sendApiResponse({ data: contactUsCMSData });
});

router.put("/", authorize(ADMIN), async (req, res) => {
  const { error, value } = validateContactUsCMSData(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let contactUsCMSData = await ContactUsCMSData.findOneAndUpdate({}, value, {
    new: true,
  });
  if (!contactUsCMSData)
    return res.sendApiResponse({
      status: 404,
      message: "ContactUsCMSData does not exist!",
    });
  res.sendApiResponse({ data: contactUsCMSData });
});

module.exports = router;
