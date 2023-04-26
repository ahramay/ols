const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { Course } = require("../../models/Course");
const {
  Lesson,
  validateLesson,
  validateMetaTags,
} = require("../../models/Lesson");
const { Quiz } = require("../../models/Quiz");
const { Question } = require("../../models/Question");
const { validateObjectId } = require("../../helpers/validation");
const {
  authorize,
  authorizeIfUser,
} = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");
const {
  getFileName,
  validateVideo,
  deleteFile,
} = require("../../helpers/file");
const Busboy = require("busboy");
const { convertVideoToHLS } = require("../../services/videoProcessing");
const _ = require("lodash");
const fileStorage = require("../../services/fileStorage");
const { ADMIN, TEACHER, TEACHER_ASSISTANT, STUDENT } = userRoles;
const { MyCourse } = require("../../models/MyCourse");
const {
  WatchedVideo,
  validateWatchedVideo,
} = require("../../models/WatchedVideo");
const { captionUpload } = require("../../middlewares/upload");
const { fileExceptionHandler } = require("../../middlewares/errors");
const moment = require("moment");

router.post("/mark_video_as_watched", authorize(), async (req, res) => {
  const { user } = req.authSession;

  const { value, error } = validateWatchedVideo(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const payload = {
    user: user._id,
    course: value.course,
    lesson: value.lesson,
  };
  const prevRecord = await WatchedVideo.findOne(payload);
  if (!prevRecord) {
    const newRecord = await new WatchedVideo(payload).save();
  }

  res.sendApiResponse({ message: "Video marked as watched" });
});
router.post("/", authorize(ADMIN), async (req, res) => {
  const { value, error } = validateLesson(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const prevLesson = await Lesson.findOne({ slug: value.slug });

  if (prevLesson)
    return res.sendApiResponse({
      status: 400,
      message: "Another lesson with this slug already exists.",
    });

  const lesson = await new Lesson(value).save();
  res.sendApiResponse({ data: lesson });
});

router.get("/chapter/:chapter", authorize(ADMIN), async (req, res) => {
  const { chapter } = req.params;
  if (!validateObjectId(chapter))
    return res.sendApiResponse({ status: 400, message: "Invalid Chapter Id" });

  const lessons = await Lesson.find({ chapter, isDeleted: false }).sort(
    "sortOrder"
  );
  res.sendApiResponse({ data: lessons });
});

router.get("/full_lesson_detail/:id", authorizeIfUser(), async (req, res) => {
  const { id } = req.params;

  let lesson;

  if (validateObjectId(id)) {
    lesson = await Lesson.findById(id).populate("chapter", "name course");
  } else {
    lesson = await Lesson.findOne({ slug: id }).populate(
      "chapter",
      "name course"
    );
  }

  if (!lesson)
    return res.sendApiResponse({ status: 404, message: "Lesson Not Found" });

  const data = _.pick(lesson, [
    "_id",
    "name",
    "chapter",
    "type",
    "accessibility",
    "video",
    "videoQualities",
    "rawVideo",
    "videoProcessingStatus",
    "published",
    "sortOrder",
    "isDeleted",
    "metaTitle",
    "metaDescription",
    "metaKeywords",
  ]);

  if (data.accessibility === "paid") {
    let user;

    if (req.authSession && req.authSession.user) user = req.authSession.user;
    if (!user)
      return res.sendApiResponse({
        data: { canShow: false },
        // status: 400,
        // message: "To View this lesson you need to enroll in this course",
      });

    if (user.role === TEACHER || user.role === TEACHER_ASSISTANT) {
      const course = await Course.findOne({
        _id: lesson.chapter.course,
        instructors: user._id,
      });

      if (!course)
        return res.sendApiResponse({
          data: { canShow: false },
          // status: 400,
          // message: "To View this lesson you need to enroll in this course",
        });
      //Course
    } else if (user.role === STUDENT) {
      console.log("Student");
      const myCourse = await MyCourse.findOne({
        user,
        course: lesson.chapter.course,
      });

      if (!myCourse)
        return res.sendApiResponse({
          data: { canShow: false },
          // status: 400,
          // message: "To View this lesson you need to enroll in this course",
        });
      const currentTime = parseInt(moment().format("X"));

      const enrollment = myCourse.chapterEnrollments.find(
        (chapterEnrollment) => {
          return (
            `${chapterEnrollment.chapter}` === `${lesson.chapter._id}` &&
            parseInt(chapterEnrollment.endDate) >= currentTime
          );
        }
      );

      if (!enrollment)
        return res.sendApiResponse({
          data: { canShow: false },
          // status: 400,
          // message: "To View this lesson you need to enroll in this course",
        });
    }
  }

  //getting Quizzes
  const quizzes = await Quiz.find({
    lesson: lesson._id,
    isDeleted: false,
  }).sort("sortOrder");

  // getting lessons of a chapter
  const quizesWithQuestions = [];
  for (let i = 0; i < quizzes.length; ++i) {
    const quiz = quizzes[i];
    const questions = await Question.find({
      isDeleted: false,
      quiz: quiz._id,
    }).sort("sortOrder");

    quizesWithQuestions.push({ ...quiz._doc, questions });
  }

  data.quizzes = quizesWithQuestions;
  data.canShow = true;
  res.sendApiResponse({ data });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

  const lesson = await Lesson.findById(id).populate("chapter", "name");
  if (!lesson)
    return res.sendApiResponse({ status: 404, message: "Lesson Not Found" });

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

  const lesson = await Lesson.findByIdAndUpdate(id, { $set: { published } });
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
    return Lesson.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ message: "Successfully Sorted!" });
});

router.put(
  "/use_another_video/:lessonId",
  authorize(ADMIN),
  async (req, res) => {
    let { videoUrl = "" } = req.body;
    videoUrl = videoUrl.trim();
    if (!videoUrl)
      return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

    const splittedArray = videoUrl.split("/");
    const videoId = splittedArray[splittedArray.length - 2];
    if (!videoId)
      return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

    const { lessonId } = req.params;

    const prevLessonWithVideo = await Lesson.findOne({ video: videoId });

    let videoQualities = ["360", "480", "720"];
    if (prevLessonWithVideo) {
      videoQualities = prevLessonWithVideo.videoQualities;
    }

    const updatedLesson = await Lesson.findByIdAndUpdate(
      lessonId,
      {
        $set: { video: videoId, videoQualities },
      },
      { new: true }
    );

    res.sendApiResponse({ data: updatedLesson });
  }
);
router.put(
  "/update_captions/:id",
  authorize(ADMIN),
  captionUpload.single("captions"),
  async (req, res) => {
    const { id } = req.params;
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

    const lesson = await Lesson.findById(id);
    if (!lesson)
      return res.sendApiResponse({ status: 404, message: "Lesson Not Found" });

    const { file } = req;

    if (!file)
      return res.sendApiResponse({
        status: 400,
        message: "Caption File is required.",
      });

    const uniqueName = getFileName(req.file.originalname);
    const uploadResult = await fileStorage.uploadFile(
      "captions/" + uniqueName,
      req.file.buffer
    );

    lesson.videoCaptions = uploadResult.Location;

    await lesson.save();
    res.sendApiResponse({
      data: lesson,
    });
  },
  fileExceptionHandler
);
router.put(
  "/update_lesson_video/:id",
  authorize(ADMIN),

  async (req, res) => {
    const { id } = req.params;
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

    const lesson = await Lesson.findById(id);
    if (!lesson)
      return res.sendApiResponse({ status: 404, message: "Lesson Not Found" });

    const busboy = new Busboy({ headers: req.headers });

    let fileUniqueName = "";

    busboy.on("file", function (fieldname, file, filename, encoding, mimetype) {
      if (fieldname !== "video")
        return res.sendApiResponse({
          status: 400,
          message: "Video field is required",
        });

      const isVideo = validateVideo(filename);
      if (!isVideo)
        return res.sendApiResponse({
          status: 400,
          message: "Invalid Video file",
        });

      fileUniqueName = getFileName(filename);

      if (!fs.existsSync("video_processing")) {
        fs.mkdirSync("video_processing");
      }

      let directoryName = "video_processing/" + fileUniqueName.split(".")[0];
      if (!fs.existsSync(directoryName)) {
        fs.mkdirSync(directoryName);
      }
      const writeStreamPath = path.resolve(
        directoryName + "/" + fileUniqueName
      );
      const fileWriteStream = fs.createWriteStream(writeStreamPath);

      fileWriteStream.on("finish", async () => {
        //start video processing
        lesson.videoProcessingStatus = "processing";
        if (process.env.NODE_ENV !== "production")
          lesson.video = fileUniqueName.split(".")[0];
        await lesson.save();

        convertVideoToHLS(
          directoryName,
          fileUniqueName,
          async (processedData) => {
            if (process.env.NODE_ENV !== "production") {
              lesson.videoQualities = processedData.videoQualities;
              await lesson.save();
              return console.log("VIDOE PROCESSING DONE");
            }
            try {
              console.log("VIDOE PROCESSING DONE");
              const encodedContents = fs.readdirSync(
                path.resolve(directoryName)
              );

              for (let i = 0; i < encodedContents.length; i++) {
                const content = encodedContents[i];
                const contentReadStream = fs.createReadStream(
                  path.resolve(directoryName, content)
                );

                const s3Res = await fileStorage.uploadFile(
                  `videos/${fileUniqueName.split(".")[0]}/` + content,
                  contentReadStream
                );
              }

              console.log("Uploading DONE");
              lesson.videoProcessingStatus = "complete";
              lesson.rawVideo = fileUniqueName;
              lesson.video = fileUniqueName.split(".")[0];
              lesson.videoQualities = processedData.videoQualities;
              await lesson.save();
              console.log("DB Updated");

              for (let j = 0; j < encodedContents.length; ++j) {
                await deleteFile(path.join(directoryName, encodedContents[j]));
                console.log(
                  "DELETED => ",
                  path.join(directoryName, encodedContents[j])
                );
              }

              fs.rmdir(
                directoryName,
                { maxRetries: 10, retryDelay: 100000 },
                (err) => {
                  console.log("Directory remove err 1", err);
                }
              );
            } catch (processingError) {
              lesson.videoProcessingStatus = "failed";
              await lesson.save();
              const encodedContents = fs.readdirSync(
                path.resolve(directoryName)
              );

              for (let z = 0; z < encodedContents.length; ++z) {
                await deleteFile(path.join(directoryName, encodedContents[z]));
              }

              fs.rmdir(directoryName, (err) => {
                console.log("Directory remove err", err);
              });
            }
          },
          async (err) => {
            lesson.videoProcessingStatus = "failed";
            await lesson.save();
            const encodedContents = fs.readdirSync(path.resolve(directoryName));

            for (let z = 0; z < encodedContents.length; ++z) {
              await deleteFile(path.join(directoryName, encodedContents[z]));
            }

            fs.rmdir(directoryName, (err) => {
              console.log("Directory remove err", err);
            });
          }
        );
      });

      file.pipe(fileWriteStream);
    });

    busboy.on("finish", function () {
      res.sendApiResponse({ message: "file uploaded" });
    });

    req.pipe(busboy);
  }
);

router.put(
  "/update_lesson_meta_tags/:id",
  authorize(ADMIN),
  async (req, res) => {
    const { id } = req.params;
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

    const { value, error } = validateMetaTags(req.body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    const lesson = await Lesson.findByIdAndUpdate(
      id,
      { $set: value },
      { new: true }
    );
    if (!lesson)
      return res.sendApiResponse({ status: 404, message: "Lesson not found" });

    res.sendApiResponse({ data: lesson });
  }
);

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

  const { value, error } = validateLesson(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const prevLesson = await Lesson.findOne({
    slug: value.slug,
  });

  if (prevLesson && `${prevLesson._id}` !== id)
    return res.sendApiResponse({
      status: 400,
      message: "Another lesson with this slug already exists.",
    });

  const lesson = await Lesson.findByIdAndUpdate(
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

  const lesson = await Lesson.findByIdAndUpdate(id, {
    $set: { isDeleted: true },
  });
  if (!lesson)
    return res.sendApiResponse({ status: 404, message: "Lesson Not Found" });

  res.sendApiResponse({ message: "Lesson Deleted" });
});
module.exports = router;
