const express = require("express");
const router = express.Router();
const { authorize } = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");
const { makeCartItem } = require("../../models/CartItem");
const _ = require("lodash");
const { Checkout } = require("../../models/Checkout");
const fileStorage = require("../../services/fileStorage");
const { imageUpload } = require("../../middlewares/upload");
const { getFileName } = require("../../helpers/file");

const { ADMIN, TEACHER } = userRoles;

// router.get("/data_table", authorize(ADMIN), async (req, res) => {
//   const {
//     draw = "1",
//     search = { value: "" },
//     start = 0,
//     length = 10,
//     order = [0, "_id"],
//   } = req.query;

//   const query = {};

//   search.value = search.value.trim();

//   if (search.value !== "") {
//     const searchExp = RegExp(`.*${search.value}.*`, "i");
//     // query.name = searchExp;
//   }

//   const orderColumn = "createdAt";
//   const sortBy = {};
//   if (order[0] === parseInt(0) && order[1] === "_id") {
//     sortBy[orderColumn] = -1;
//   }
//   const queryObj = Checkout.find(query)

//     .skip(parseInt(start))
//     .limit(parseInt(length))
//     .populate("parent")
//     .sort("-_id");

//   const data = await queryObj;

//   const recordsFiltered = await Checkout.find(query).count();
//   const recordsTotal = recordsFiltered;

//   const categories = {
//     draw,
//     recordsTotal,
//     recordsFiltered,
//     data,
//   };
//   res.send(categories);
// });

router.get("/all_orders", authorize(ADMIN), async (req, res) => {
  const myOrders = await Checkout.find({})
    .populate("user", "firstName lastName email phone image")
    .sort("-createdAt");

  res.sendApiResponse({ data: myOrders });
});

router.get("/my_orders", authorize(), async (req, res) => {
  const { user } = req.authSession;

  const myOrders = await Checkout.find({ user: user._id });

  res.sendApiResponse({ data: myOrders });
});

router.get("/:id", authorize(), async (req, res) => {
  const { id } = req.params;
  const { user } = req.authSession;
  let order;

  if (user.role === ADMIN) {
    order = await Checkout.findById(id);
  } else {
    order = await Checkout.findOne({ _id: id, user: user._id });
  }
  const data = { ...order._doc };
  const items = [];
  for (let i = 0; i < order.items.length; ++i) {
    if (order.items[i]) {
      items.push(await makeCartItem(order.items[i]));
    }
  }
  data.items = items;
  if (!order)
    return res.sendApiResponse({ status: 404, message: "Order not found" });

  res.sendApiResponse({ data });
});

router.put(
  "/add_payment_recipt/:id",
  authorize(),
  imageUpload.single("image"),
  async (req, res) => {
    const { id } = req.params;

    if (!req.file)
      return res.sendApiResponse({
        status: 400,
        message: "Receipt is required",
      });

    const uniqueName = getFileName(req.file.originalname);
    const uploadResult = await fileStorage.uploadFile(
      "images/" + uniqueName,
      req.file.buffer
    );

    const { user } = req.authSession;

    const result = await Checkout.findOneAndUpdate(
      { _id: id, user: user._id },
      {
        $set: {
          paymentReciptImage: uploadResult.Location,
        },
      },
      { new: true }
    );

    if (!result)
      return res.sendApiResponse({ status: 400, message: "Order not found" });
  }
);

router.put("/refund/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;

  const { refunded } = req.body;

  if (typeof refunded !== "boolean")
    return res.sendApiResponse({
      status: 400,
      message: "refunded must be a boolean value",
    });

  const update = await Checkout.findByIdAndUpdate(id, {
    $set: {
      refunded,
    },
  });

  if (!update)
    return res.sendApiResponse({ status: 400, message: "Failed to refund" });

  res.sendApiResponse({ message: "Refunded updated" });
});

module.exports = router;
