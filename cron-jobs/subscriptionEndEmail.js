const cron = require("node-cron");
const moment = require("moment");
const { Checkout } = require("../models/Checkout");
const { Course } = require("../models/Course");
const { sendOSubscriptionExpiryEmail } = require("../services/mailer");

const daysBefreExpiry = 3;

const taskRunner = async () => {
  const currentTimeStamp = parseInt(
    moment().add(daysBefreExpiry, "days").format("X")
  );

  const checkouts = await Checkout.find({
    expiryNotificationDate: {
      $exists: true,
      $lte: currentTimeStamp,
    },
    expiryNotified: false,
  }).populate("user");

  checkouts.forEach(async (checkout) => {
    const { email, firstName, lastName } = checkout.user;
    const courseIds = [];
    checkout.items.forEach((item) => {
      if (item.itemType === "BUNDLE") {
        item.courses.forEach((c) => {
          courseIds.push(`${c}`);
        });
      } else {
        courseIds.push(`${item.course}`);
      }
    });
    const courses = await Course.find({
      _id: { $in: courseIds },
    }).select("category name");

    if (!courses) return;

    const category = courses[0].category;

    await sendOSubscriptionExpiryEmail({
      to: email,
      user_name: `${firstName} ${lastName}`,
      category_name: category.name,
      courses: courses.map((c) => c.name),
    });
    await Checkout.findByIdAndUpdate(checkout._id, {
      $set: {
        expiryNotified: true,
      },
    });
  });
};

module.exports = () => {
  cron.schedule("*/60 * * * *", () => {
    taskRunner();
  });
};
