const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Faq, validateFaqSchema } = require("../../../models/Faq");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.post("/", authorize(ADMIN), async (req, res) => {
  const { error, value } = validateFaqSchema(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let footerLinks = await new Faq(value).save();
  res.sendApiResponse({ data: footerLinks });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let footerLinks = await Faq.findById(id);
  if (!footerLinks)
    return res.sendApiResponse({
      status: 404,
      message: "Footer Link with this ID does not exist!",
    });
  res.sendApiResponse({ data: footerLinks });
});

router.get("/", async (req, res) => {
  let footerLinks = await Faq.find({}).sort("sortOrder");

  res.sendApiResponse({ data: footerLinks });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return Faq.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ message: "Successfully Sorted!" });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  const { error, value } = validateFaqSchema(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let footerLinks = await Faq.findByIdAndUpdate(id, value, {
    new: true,
  });
  if (!footerLinks)
    return res.sendApiResponse({
      status: 404,
      message: "Footer Link with this ID does not exist!",
    });
  res.sendApiResponse({ data: footerLinks });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let footerLinks = await Faq.findByIdAndDelete(id);
  if (!footerLinks)
    return res.sendApiResponse({
      status: 404,
      message: "Footer Link with this ID does not exist!",
    });
  res.sendApiResponse({ data: footerLinks });
});

module.exports = router;
