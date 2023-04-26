const express = require("express");
const router = express.Router();
const { Footer, validateFooter } = require("../../../models/Footer");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

// router.post("/", authorize(ADMIN), async (req, res) => {
//   let existData = await Footer.findOne({});
//   if (existData)
//     return res.sendApiResponse({
//       status: 400,
//       message: "Footer already exists!",
//     });
//   const { error, value } = validateFooter(req.body);
//   if (error)
//     return res.sendApiResponse({
//       status: 400,
//       message: error.details[0].message,
//     });
//   let footer = await new Footer(value).save();
//   res.sendApiResponse({ data: footer });
// });

router.get("/", async (req, res) => {
  let footer = await Footer.findOne({});
  if (!footer)
    return res.sendApiResponse({ data: { paragraph: "", copyrightText: "" } });
  res.sendApiResponse({ data: footer });
});

router.put("/", authorize(ADMIN), async (req, res) => {
  const { error, value } = validateFooter(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let footer = await Footer.findOneAndUpdate({}, value, { new: true });
  if (!footer) {
    footer = new Footer(value).save();
  }
  res.sendApiResponse({ data: footer });
});

// router.delete("/", authorize(ADMIN), async (req, res) => {
//   let footer = await Footer.findOneAndDelete({});
//   if (!footer)
//     return res.sendApiResponse({
//       status: 404,
//       message: "Footer does not exist!",
//     });
//   res.sendApiResponse({ data: footer });
// });

module.exports = router;
