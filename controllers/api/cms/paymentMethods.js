const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  PaymentMethods,
  validatePaymentMethods,
} = require("../../../models/PaymentMethods");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.post("/", authorize(ADMIN), async (req, res) => {
  const { error, value } = validatePaymentMethods(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let paymentMethods = await new PaymentMethods(value).save();
  res.sendApiResponse({ data: paymentMethods });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let paymentMethods = await PaymentMethods.findById(id);
  if (!paymentMethods)
    return res.sendApiResponse({
      status: 404,
      message: "Payment Method with this ID does not exist!",
    });
  res.sendApiResponse({ data: paymentMethods });
});

router.get("/", async (req, res) => {
  let paymentMethods = await PaymentMethods.find({}).sort("sortOrder");

  res.sendApiResponse({ data: paymentMethods });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return PaymentMethods.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ message: "Successfully Sorted!" });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  const { error, value } = validatePaymentMethods(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  let paymentMethods = await PaymentMethods.findByIdAndUpdate(id, value, {
    new: true,
  });
  if (!paymentMethods)
    return res.sendApiResponse({
      status: 404,
      message: "Payment Method with this ID does not exist!",
    });
  res.sendApiResponse({ data: paymentMethods });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let paymentMethods = await PaymentMethods.findByIdAndDelete(id);
  if (!paymentMethods)
    return res.sendApiResponse({
      status: 404,
      message: "Payment Method with this ID does not exist!",
    });
  res.sendApiResponse({ data: paymentMethods });
});

module.exports = router;
