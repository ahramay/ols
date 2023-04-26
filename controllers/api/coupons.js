const express = require("express");
const router = express.Router();
const { authorize } = require("../../middlewares/authorization");

const { Coupon, validateCoupon } = require("../../models/Coupon");

const _ = require("lodash");
const { userRoles } = require("../../models/User");
const { validateObjectId } = require("../../helpers/validation");
const { ADMIN } = userRoles;

router.get("/all_coupons", authorize(ADMIN), async (req, res) => {
  const {
    draw = "1",
    search = { value: "" },
    start = 0,
    length = 10,
    order = [],
  } = req.query;

  const query = {
    isDeleted: false,
  };

  search.value = search.value.trim();

  if (search.value !== "") {
    const searchExp = RegExp(`.*${search.value}.*`, "i");
    query.$or = [{ code: searchExp }];
  }

  const data = await Coupon.find(query)
    .skip(parseInt(start))
    .limit(parseInt(length))
    .sort("-_id")
    .populate("course", "_id name")
    .populate("category", "_id name");

  const recordsFiltered = await Coupon.find(query).count();
  const recordsTotal = await Coupon.find({}).count();

  const coupons = {
    draw,
    recordsTotal,
    recordsFiltered,
    data,
  };
  res.send(coupons);
});

router.get("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Coupon Id" });

  const coupon = await Coupon.findById(id)
    .populate("course", "_id name")
    .populate("category", "_id name");
  if (!coupon)
    return res.sendApiResponse({ status: 404, message: "Coupon not found!" });

  res.sendApiResponse({ data: coupon });
});

router.post("/create_coupon", authorize(ADMIN), async (req, res) => {
  const { value, error } = validateCoupon(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const {
    code = "",
    discountType = "flat",
    discount = 1,
    applicableTo = "category",
    reusability = "overall",
    referalEmails = "",
    reusabilityCount,
    validTill,
    isActive,
  } = value;

  const prevCoupon = await Coupon.findOne({ code, isDeleted: false });
  if (prevCoupon)
    return res.sendApiResponse({
      status: 400,
      message: "Coupon code already exists!",
    });

  const couponData = {
    code,
    discountType,
    discount,
    applicableTo,
    reusability,
    validTill,
    referalEmails,
    isActive,
  };

  couponData[applicableTo] = (value[applicableTo] && value[applicableTo]) || ""; // equvalient to => couponData.category = value.category  || couponData.course = value.course

  if (reusability !== "unlimited")
    couponData.reusabilityCount = reusabilityCount;

  const coupon = await new Coupon(couponData).save();

  res.sendApiResponse({ data: coupon });
});

router.put("/activate/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Chapter Id" });

  let { isActive } = req.body;

  if (typeof isActive !== "boolean")
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Activate Property",
    });

  const chapter = await Coupon.findByIdAndUpdate(id, { $set: { isActive } });
  if (!chapter)
    return res.sendApiResponse({ status: 404, message: "Chapter Not Found" });

  res.sendApiResponse({
    message: isActive ? "Coupon Activated" : "Coupon Deactivated",
  });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Coupon Id" });

  const { value, error } = validateCoupon(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const {
    code = "",
    discountType = "flat",
    discount = 1,
    applicableTo = "category",
    reusability = "overall",
    reusabilityCount,
    referalEmails = "",
    validTill,
    isActive,
  } = value;

  const prevCoupon = await Coupon.findOne({ code, isDeleted: false });

  if (prevCoupon && `${prevCoupon._id}` !== id)
    return res.sendApiResponse({
      status: 400,
      message: "Coupon code already exists!",
    });

  const couponData = {
    code,
    discountType,
    discount,
    applicableTo,
    reusability,
    referalEmails,
    validTill,
    isActive,
  };

  couponData[applicableTo] = (value[applicableTo] && value[applicableTo]) || ""; // equvalient to => couponData.category = value.category  || couponData.course = value.course

  if (reusability !== "unlimited")
    couponData.reusabilityCount = reusabilityCount;

  const coupon = await Coupon.findByIdAndUpdate(id, { $set: couponData });

  res.sendApiResponse({ data: coupon });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Coupon Id" });

  const coupon = await Coupon.findByIdAndUpdate(
    id,
    {
      $set: { isDeleted: true },
    },
    { new: true }
  );

  if (!coupon)
    return res.sendApiResponse({ status: 404, message: "Coupon not found!" });

  res.sendApiResponse({ data: coupon });
});

module.exports = router;
