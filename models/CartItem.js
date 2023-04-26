const mongoose = require("mongoose");
const Joi = require("joi");
const _ = require("lodash");
const { Course } = require("./Course");
const { Chapter } = require("./Chapter");

const cartItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "course",
  },

  chapters: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "chapter",
  },

  courses: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "course",
  },

  itemType: {
    type: String,
    default: "SINGLE",
    enum: ["SINGLE", "BUNDLE"],
  },

  completeCourse: {
    type: Boolean,
    default: false,
  },

  bundlePrice: {
    type: Number,
  },

  numberOfDays: {
    type: Number,
  },

  createdAt: {
    type: Date,
    default: new Date(),
  },
});

function validateCartItem(input) {
  const schema = Joi.object({
    course: Joi.objectId().required(),
    chapters: Joi.array().items(Joi.objectId()).min(1).required(),
    completeCourse: Joi.boolean().required(),
  });
  return schema.validate(input);
}

function validateBundleItem(input) {
  const schema = Joi.object({
    courses: Joi.array().required(),
    numberOfDays: Joi.number().required(),
    bundlePrice: Joi.number().required(),
  });
  return schema.validate(input);
}

const makeCartItem = async (cartItem, coupon) => {
  const item = _.pick(cartItem, [
    "_id",
    "user",
    "course",
    "chapters",
    "completeCourse",
    "createdAt",
    "itemType",
    "bundlePrice",
  ]);

  if (cartItem.itemType === "BUNDLE") {
    const courses = await Course.find({ _id: { $in: cartItem.courses } });
    if (!courses) return;

    item.courses = courses.map((c) =>
      _.pick(c, ["_id", "name", "image", "chapters", "price", "category"])
    );
    item.price = item.bundlePrice;
  } else {
    const course = await Course.findById(cartItem.course).select(
      "name image chapters price category"
    );

    if (!course) return;

    item.course = _.pick(course, [
      "_id",
      "name",
      "image",
      "chapters",
      "price",
      "category",
    ]);

    item.chapters = await Chapter.find({
      _id: { $in: cartItem.chapters },
      course: cartItem.course,
      isDeleted: false,
      published: true,
    }).select("name price");

    if (item.completeCourse) item.price = course.price;
    else {
      item.price = 0;
      for (let i = 0; i < item.chapters.length; i++) {
        if (item.chapters[i]) item.price += item.chapters[i].price;
      }
    }
    item.total = item.price;

    if (coupon) {
      let canUse = false;
      switch (coupon.reusability) {
        case "unlimited":
          canUse = true;
          break;

        case "overall":
          canUse = true;
          break;

        case "per_user":
          canUse = true;
      }

      if (canUse) {
        let isApplicable = false;
        switch (coupon.applicableTo) {
          case "courses":
            isApplicable = coupon.courses.includes(item.course._id);
            break;
        }
      }
    }
  }
  return item;
};

const CartItem = mongoose.model("cartitem", cartItemSchema);

module.exports = {
  CartItem,
  validateCartItem,
  validateBundleItem,
  makeCartItem,
};
