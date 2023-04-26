const express = require("express");
const router = express.Router();

const { Quiz, validateQuiz } = require("../../models/Quiz");
const { QuizAnswer } = require("../../models/QuizAnswer");
const { Lesson } = require("../../models/Lesson");
const { Question } = require("../../models/Question");
const { Chapter } = require("../../models/Chapter");
const { Course } = require("../../models/Course");

const { validateObjectId } = require("../../helpers/validation");
const { authorize } = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");

const { ADMIN, TEACHER, TEACHER_ASSISTANT } = userRoles;

router.get(
  "/teacher_courses_quizzes/:courseId",
  authorize([TEACHER, TEACHER_ASSISTANT]),
  async (req, res) => {
    const { courseId } = req.params;
    const {
      draw = "1",
      search = { value: "" },
      start = 0,
      length = 10,
      order = [],
    } = req.query;

    const { user } = req.authSession;

    // const courses = await Course.find({
    //   isDeleted: false,
    //   published: true,
    //   instructors: user._id,
    // });

    // const coursesIds = courses.map((c) => c._id);

    const query = {
      course: courseId,
      // course: { $in: coursesIds },
    };

    search.value = search.value.trim();

    if (search.value !== "") {
      const searchExp = RegExp(`.*${search.value}.*`, "i");
      query.$or = [
        { firstName: searchExp },
        { lastName: searchExp },
        { email: searchExp },
      ];
    }

    // const columns = [
    //   "firstName",
    //   "lastName",
    //   "school",
    //   "dateOfBirth",
    //   "role",
    //   "phoneNumber",
    //   "email",
    //   "_id",
    // ];

    const sortBy = {
      markedByTeacher: 1,
    };

    console.log("SORT ", order);

    // order.forEach((o, index) => {
    //   const colName = columns[o.column];
    //   sortBy[colName] = o.dir === "desc" ? -1 : 1;
    // });

    console.log("SORt OBJ =>", sortBy);
    const data = await QuizAnswer.find(query)
      .sort(sortBy)
      .skip(parseInt(start))
      .limit(parseInt(length))
      .populate("quiz", "name")
      .populate("course", "name category");

    const recordsFiltered = await QuizAnswer.find(query).count();
    const recordsTotal = await QuizAnswer.find({ course: courseId }).count();

    const quizzes = {
      draw,
      recordsTotal,
      recordsFiltered,
      data,
    };
    res.send(quizzes);
  }
);

router.get("/course_quizzes/:id", authorize(), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Course Id" });

  const { user } = req.authSession;
  const quizAnswers = await QuizAnswer.find({
    user: user._id,
    course: id,
  })
    .sort("-_id")
    .populate("quiz", "name")
    .populate("course", "name category");

  res.sendApiResponse({ data: quizAnswers });
});
router.get("/get_quiz_with_answer/:id", authorize(), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Answer Id" });

  const quizAnswer = await QuizAnswer.findById(id)
    .populate("user", "firstName lastName email image")
    .populate("course")
    .populate("quiz");

  if (!quizAnswer)
    return res.sendApiResponse({
      status: 404,
      message: "Quiz Not Found",
    });

  const questions = await Question.find({
    quiz: quizAnswer.quiz._id,
    isDeleted: false,
  });

  const data = {
    ...quizAnswer._doc,
    questions,
  };

  res.sendApiResponse({ data });
});
router.get("/lesson/:lesson", authorize(ADMIN), async (req, res) => {
  const { lesson } = req.params;
  if (!validateObjectId(lesson))
    return res.sendApiResponse({ status: 400, message: "Invalid lesson Id" });

  const quizes = await Quiz.find({ lesson, isDeleted: false }).sort(
    "sortOrder"
  );
  res.sendApiResponse({ data: quizes });
});

router.get("/course_quiz_answers/:courseId", authorize(), async (req, res) => {
  const { courseId } = req.params;
  if (!validateObjectId(courseId))
    return res.sendApiResponse({ status: 400, message: "Invalid Course Id" });
  const { user } = req.authSession;

  const answers = await QuizAnswer.find({
    user: user._id,
    course: courseId,
    markedByTeacher: true,
  }).populate("quiz");

  res.sendApiResponse({ data: answers });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

  const quiz = await Quiz.findById(id).populate("lesson", "name");
  if (!quiz)
    return res.sendApiResponse({ status: 404, message: "quiz Not Found" });

  res.sendApiResponse({ data: quiz });
});

router.post(
  "/mark_quiz_answer/:answerId",
  authorize([TEACHER, TEACHER_ASSISTANT]),
  async (req, res) => {
    const { answerId } = req.params;

    const { questionMarks, obtainedMarks, totalQuizMarks } = req.body;
    const updated = await QuizAnswer.findByIdAndUpdate(answerId, {
      $set: {
        questionMarks,
        markedByTeacher: true,
        obtainedMarks,
        totalQuizMarks,
      },
    });

    res.sendApiResponse({ message: "Quiz Marked" });
  }
);
router.post("/answer_quiz/:id", authorize(), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Quiz Id" });

  const quiz = await Quiz.findById(id);
  if (!quiz)
    return res.sendApiResponse({ status: 400, message: "Invalid Quiz Id" });

  const lesson = await Lesson.findById(quiz.lesson).populate(
    "chapter",
    "course"
  );

  const answers = req.body;
  const { user } = req.authSession;

  const data = {
    user: user._id,
    answers,
    quiz: id,
    lesson: lesson._id,
    chapter: lesson.chapter,
    course: lesson.chapter.course,
  };
  const prevQuiz = await QuizAnswer.findOne({ user: user._id, quiz: id });
  if (prevQuiz) {
    prevQuiz.answers = answers;
    await prevQuiz.save();
    return res.sendApiResponse({ data: prevQuiz });
  }
  const ans = await new QuizAnswer(data).save();

  res.sendApiResponse({ data: ans });
});
router.post("/", authorize(ADMIN), async (req, res) => {
  const { value, error } = validateQuiz(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  if (value.type === "standalone") {
    const prevStandAloneInThisLesson = await Quiz.findOne({
      lesson: value.lesson,
      type: "standalone",
      isDeleted: false,
    });

    if (prevStandAloneInThisLesson)
      return res.sendApiResponse({
        status: 400,
        message: "A lesson can have only one standalone quiz.",
      });
  }

  const lesson = await new Quiz(value).save();
  res.sendApiResponse({ data: lesson });
});

router.put("/publish/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

  let { published } = req.body;
  if (typeof published !== "boolean")
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Publish Property",
    });

  const lesson = await Quiz.findByIdAndUpdate(id, { $set: { published } });
  if (!lesson)
    return res.sendApiResponse({ status: 404, message: "Lesson Not Found" });

  res.sendApiResponse({
    message: published ? "Lesson Published" : "Lesson Unpublished",
  });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return Quiz.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ message: "Successfully Sorted!" });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

  const { value, error } = validateQuiz(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  if (value.type === "standalone") {
    const prevStandAloneInThisLesson = await Quiz.findOne({
      lesson: value.lesson,
      type: "standalone",
      isDeleted: false,
    });

    if (
      prevStandAloneInThisLesson &&
      `${prevStandAloneInThisLesson._id}` !== id
    )
      return res.sendApiResponse({
        status: 400,
        message: "A lesson can have only one standalone quiz.",
      });
  }
  const lesson = await Quiz.findByIdAndUpdate(
    id,
    { $set: value },
    { new: true }
  );
  if (!lesson)
    return res.sendApiResponse({ status: 404, message: "Lesson not found" });

  res.sendApiResponse({ data: lesson });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

  const lesson = await Quiz.findByIdAndUpdate(id, {
    $set: { isDeleted: true },
  });
  if (!lesson)
    return res.sendApiResponse({ status: 404, message: "Lesson Not Found" });

  res.sendApiResponse({ message: "Lesson Deleted" });
});
module.exports = router;
