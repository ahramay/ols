const express = require("express");
const router = express.Router();

const { validateObjectId } = require("../../helpers/validation");
const { authorize } = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");

const {
  ForumThread,
  validateForumThread,
} = require("../../models/ForumThread");

const {
  ForumMessage,
  validateForumMessage,
} = require("../../models/ForumMessage");

const { Course } = require("../../models/Course");
const { MyCourse } = require("../../models/MyCourse");

const moment = require("moment");
const { imageUpload } = require("../../middlewares/upload");
const { getFileName } = require("../../helpers/file");
const fileStorage = require("../../services/fileStorage");

const { ADMIN, TEACHER, TEACHER_ASSISTANT } = userRoles;

router.get("/get_threads/:courseId", authorize(), async (req, res) => {
  const { courseId } = req.params;

  if (!validateObjectId(courseId))
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Course ID.",
    });

  const threads = await ForumThread.find({ course: courseId })
    .sort("-createdAt")
    .populate("user", "firstName lastName email image")
    .populate("lastAnswer", "message");
  res.sendApiResponse({ data: threads });
});

router.get("/get_thread/:threadId", authorize(), async (req, res) => {
  const { threadId } = req.params;

  const thread = await ForumThread.findById(threadId)
    .populate("user", "firstName lastName role email image")
    .populate("lastAnswer");

  return res.sendApiResponse({ data: thread });
});

router.get("/thread_messages/:threadId", authorize(), async (req, res) => {
  const { threadId } = req.params;
  const messages = await ForumMessage.find({ thread: threadId }).populate(
    "user",
    "firstName lastName role image"
  );

  res.sendApiResponse({ data: messages });
});
router.post("/create_thread", authorize(), async (req, res) => {
  const { value, error } = validateForumThread(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { user } = req.authSession;

  let canCreateThread = false;

  if (user.role === ADMIN) canCreateThread = true;
  else if (user.role === TEACHER || user.role === TEACHER_ASSISTANT) {
    const course = await Course.findOne({
      _id: value.course,
      instructors: user._id,
    });
    if (!course)
      return res.sendApiResponse({
        status: 400,
        message: "You hanve no access to create thread in this forum",
      });
    canCreateThread = true;
  } else {
    const currentTimeStamp = parseInt(moment().format("X"));
    const mycourse = await MyCourse.findOne({
      user: user._id,
      course: value.course,
      endDate: { $gte: currentTimeStamp },
    });

    if (!mycourse)
      return res.sendApiResponse({
        status: 400,
        message: "You hanve no access to create thread in this forum",
      });
  }
  const forumThread = await new ForumThread({
    ...value,
    user: user._id,
    createdAt: Date.now(),
  }).save();

  res.sendApiResponse({ data: forumThread });
});
router.post("/answer_thread", authorize(), async (req, res) => {
  const { value, error } = validateForumMessage(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { user } = req.authSession;

  const threadMessage = await new ForumMessage({
    ...value,
    user: user._id,
  }).save();

  const updateThread = await ForumThread.findByIdAndUpdate(value.thread, {
    $set: { lastAnswer: threadMessage._id },
    $inc: { answers: 1 },
  });
  res.sendApiResponse({ data: threadMessage });
});

router.delete("/delete_thread/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;

  const thread = await ForumThread.findByIdAndDelete(id);

  res.sendApiResponse({ message: "Forum Thread Deleted" });
});
router.delete("/delete_message/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;

  const message = await ForumMessage.findById(id);

  const thread = await ForumThread.findById(message.thread);
  if (thread.lastAnswer === id) {
    const prevMessage = await ForumMessage.find({ thread: message.thread })
      .skip(1)
      .limit(1);

    if (prevMessage && prevMessage[0]) {
      thread.lastAnswer = prevMessage[0]._id;
      await thread.save();
    } else {
      thread.lastAnswer = null;
      await thread.save();
    }
  }

  await ForumMessage.findByIdAndDelete(id);
  res.sendApiResponse({ message: "Message deleted" });
});
module.exports = router;
