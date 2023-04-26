const express = require("express");
const router = express.Router();
const {
  HowToPayCMSData,
  validateHowToPayCMSData,
} = require("../../../models/HowToPayCMSData");
const { PaymentMethods } = require("../../../models/PaymentMethods");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.post("/", authorize(ADMIN), async (req, res) => {
  let existData = await HowToPayCMSData.findOne({});
  if (existData)
    return res.sendApiResponse({
      status: 400,
      message: "HowToPayCMSData already exists!",
    });
  const { error, value } = validateHowToPayCMSData(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let howtopayCMSData = await new HowToPayCMSData(value).save();
  res.sendApiResponse({ data: howtopayCMSData });
});

router.get("/", async (req, res) => {
  let howtopayCMSData = await HowToPayCMSData.findOne({});

  howtopayCMSData.paymentMethods = await PaymentMethods.find({});
  if (!howtopayCMSData)
    return res.sendApiResponse({
      status: 404,
      message: "HowToPayCMSData does not exist!",
    });
  res.sendApiResponse({ data: howtopayCMSData });
});

router.put("/", authorize(ADMIN), async (req, res) => {
  const { error, value } = validateHowToPayCMSData(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let howtopayCMSData = await HowToPayCMSData.findOneAndUpdate({}, value, {
    new: true,
  });
  if (!howtopayCMSData)
    return res.sendApiResponse({
      status: 404,
      message: "HowToPayCMSData does not exist!",
    });
  res.sendApiResponse({ data: howtopayCMSData });
});

router.delete("/", authorize(ADMIN), async (req, res) => {
  let howtopayCMSData = await HowToPayCMSData.findOneAndDelete({});
  if (!howtopayCMSData)
    return res.sendApiResponse({
      status: 404,
      message: "HowToPayCMSData does not exist!",
    });
  res.sendApiResponse({ data: howtopayCMSData });
});

module.exports = router;
