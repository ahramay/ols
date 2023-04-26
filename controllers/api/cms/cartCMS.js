const express = require("express");
const router = express.Router();
const { CartCMS, validateCartCMSData } = require("../../../models/CartCMS");

const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");

const { ADMIN } = userRoles;

router.get("/", async (req, res) => {
  let cartCMSData = await CartCMS.findOne({});

  if (!cartCMSData)
    cartCMSData = await new CartCMS({
      heading1: "#",
      text1: "#",
      heading2: "#",
      text2: "#",
      heading3: "#",
      text3: "#",
    }).save();
  res.sendApiResponse({ data: cartCMSData });
});

router.put(
  "/",
  authorize(ADMIN),

  async (req, res) => {
    const { error, value } = validateCartCMSData(req.body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    let aboutusCMSData = await CartCMS.findOneAndUpdate({}, value, {
      new: true,
    });

    res.sendApiResponse({ data: aboutusCMSData });
  }
);

module.exports = router;
