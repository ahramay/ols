const express = require("express");
const _ = require("lodash");
const {
  SubscriptionPlan,
  validateSubscriptionPlan,
} = require("../../models/SubscriptionPlan");
const { validateObjectId } = require("../../helpers/validation");
const { authorize } = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");
const { ADMIN } = userRoles;
const { getFileName } = require("../../helpers/file");
const { imageUpload } = require("../../middlewares/upload");
const fileStorage = require("../../services/fileStorage");
const { fileExceptionHandler } = require("../../middlewares/errors");

const router = express.Router();

router.get("/data_table", authorize(ADMIN), async (req, res) => {
  const {
    draw = "1",
    search = { value: "" },
    start = 0,
    length = 10,
    order = [0, "_id"],
  } = req.query;

  const query = {};

  search.value = search.value.trim();

  if (search.value !== "") {
    const searchExp = RegExp(`.*${search.value}.*`, "i");
    query.name = searchExp;
  }

  const orderColumn = "createdAt";
  const sortBy = {};
  if (order[0] === parseInt(0) && order[1] === "_id") {
    sortBy[orderColumn] = -1;
  }
  const queryObj = SubscriptionPlan.find(query)
    .skip(parseInt(start))
    .limit(parseInt(length))
    .populate("category");

  const data = await queryObj;

  const recordsFiltered = await SubscriptionPlan.find(query).count();
  const recordsTotal = await SubscriptionPlan.find({
    isDeleted: false,
  }).count();

  const plans = {
    draw,
    recordsTotal,
    recordsFiltered,
    data,
  };
  res.send(plans);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Plan Id" });
  const plan = await SubscriptionPlan.findById(id);
  if (!plan)
    return res.sendApiResponse({ status: 404, message: "Plan not found" });
  res.sendApiResponse({ data: plan });
});

router.get("/", async (req, res) => {
  const pipeline = [
    {
      $lookup: {
        from: "priceplans",
        as: "pricePlans",
        let: {
          price_plan_id: "$_id",
        },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$subscriptionPlan", "$$price_plan_id"] },
            },
          },
          { $sort: { sortOrder: 1 } },
        ],
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $sort: { sortOrder: 1 } },
  ];
  const subscriptionPlans = await SubscriptionPlan.aggregate(pipeline);

  const data = subscriptionPlans.map((plan) => {
    const p = _.pick(plan, [
      "_id",
      "name",
      "cardImage",
      "smallImage",
      "numberOfCourses",
      "pricePlans",
      "chooseText",
      "accessibleText",
    ]);
    p.category = plan.category[0];
    return p;
  });
  res.sendApiResponse({ data });
});

router.post("/", authorize(ADMIN), async (req, res) => {
  const { value, error } = validateSubscriptionPlan(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  const plan = await new SubscriptionPlan(value).save();
  res.sendApiResponse({ data: plan });
});

["cardImage", "smallImage"].forEach((key) => {
  router.put(
    `/:id/${key}`,
    authorize(ADMIN),
    imageUpload.single("image"),
    async (req, res) => {
      const { id } = req.params;
      if (!validateObjectId(id))
        return res.sendApiResponse({ status: 400, message: "Invalid Plan Id" });

      const { file } = req;
      if (!file)
        return res.sendApiResponse({
          status: 400,
          message: "Please upload an image file.",
        });
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );

      let subPlan = await SubscriptionPlan.findByIdAndUpdate(
        id,
        { $set: { [key]: uploadResult.Location } },
        {
          new: true,
        }
      );
      res.sendApiResponse({ data: subPlan });
    },
    fileExceptionHandler
  );
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return SubscriptionPlan.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ message: "Successfully Sorted!" });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 404, message: "Invalid Plan Id" });

  const { value, error } = validateSubscriptionPlan(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const plan = await SubscriptionPlan.findByIdAndUpdate(
    id,
    { $set: value },
    { new: true }
  );
  if (!plan)
    return res.sendApiResponse({ status: 404, message: "Plan not found!" });
  res.sendApiResponse({ data: plan });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Subscription Id",
    });

  const plan = await SubscriptionPlan.findByIdAndRemove(id);

  if (!plan)
    return res.sendApiResponse({
      status: 404,
      message: "Subscription not found!",
    });

  res.sendApiResponse({ data: plan });
});

module.exports = router;
