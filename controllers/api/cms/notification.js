const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const {
  Notification,
  validateNotification,
} = require("../../../models/Notification");
const { User } = require("../../../models/User");
const { Category } = require("../../../models/Category");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN, STUDENT } = userRoles;

router.post(
  "/",
  authorize(ADMIN),

  async (req, res) => {
    const { error, value } = validateNotification(req.body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    let notification = await new Notification(value).save();
    res.sendApiResponse({ data: notification });
  }
);

router.get("/category", async (req, res) => {
  const category = await Category.find({});
  res.sendApiResponse({ data: category });
});

router.get("/seen_notification", authorize(ADMIN), async (req, res) => {
  const user = req.authSession.user;
  let notification = await Notification.find({
    category: user.category,
    seenBy: { $nin: [user._id] },
  });
  let seen = false;
  if (notification.length) {
    seen = true;
  }
  res.sendApiResponse({ data: { unseen: seen } });
});

router.get("/", authorize(ADMIN), async (req, res) => {
  const user = req.authSession.user;
  let notification = await Notification.find({
    category: user.category,
  });
  res.sendApiResponse({ data: notification });
});

router.get("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  const user = req.authSession.user;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let notification = await Notification.findById(id);
  const seenArr = notification.seenBy;
  let includeArr = seenArr.includes(user._id);
  if (includeArr !== true) {
    seenArr.push(user._id);
    await notification.save();
  }
  if (!notification)
    return res.sendApiResponse({
      status: 404,
      message: "Notification with this ID does not exist!",
    });
  res.sendApiResponse({ data: notification });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let notification = await Notification.findByIdAndDelete(id);
  if (!notification)
    return res.sendApiResponse({
      status: 404,
      message: "Notification with this ID does not exist!",
    });
  res.sendApiResponse({ data: notification });
});

module.exports = router;
