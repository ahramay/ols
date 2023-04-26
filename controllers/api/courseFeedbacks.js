const express = require("express");
const router = express.Router();
const { Course } = require("../../models/Course");
const { validateObjectId } = require("../../helpers/validation");
const { authorize } = require("../../middlewares/authorization");
const {
  CourseFeedback,
  validateCourseFeedback,
} = require("../../models/CourseFeedback");
const { userRoles } = require("../../models/User");
const { ADMIN, TEACHER, TEACHER_ASSISTANT } = userRoles;
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
  const queryObj = CourseFeedback.find(query)
    .skip(parseInt(start))
    .limit(parseInt(length))
    .populate("course", "name category")
    .sort("-_id");

  const data = await queryObj;

  const recordsFiltered = await CourseFeedback.find(query).count();
  const recordsTotal = await CourseFeedback.find({ isDeleted: false }).count();

  const categories = {
    draw,
    recordsTotal,
    recordsFiltered,
    data,
  };
  res.send(categories);
});

router.get("/get_all_feedacks", authorize(ADMIN), async (req, res) => {
  const feedbacks = await CourseFeedback.find({})
    .populate("course", "name category")
    .sort("-createdAt");

  res.sendApiResponse({ data: feedbacks });
});

router.post("/give_feedback/:id", async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id))
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Course ID.",
    });

  const { value, error } = validateCourseFeedback(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const course = await Course.findById(id);
  if (!course)
    return res.sendApiResponse({ status: 404, message: "Course not found" });

  courseReview = await new CourseFeedback({
    ...value,
    course: id,
    createdAt: new Date(),
  }).save();

  await course.save();
  res.sendApiResponse({ data: courseReview });
});

module.exports = router;
