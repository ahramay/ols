const express = require("express");
const router = express.Router();
const {
  authorize,
  authorizeIfUser,
} = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");
const fileStorage = require("../../services/fileStorage");
const { imageUpload } = require("../../middlewares/upload");
const { getFileName } = require("../../helpers/file");
const { validateObjectId } = require("../../helpers/validation");
const _ = require("lodash");
const { fileExceptionHandler } = require("../../middlewares/errors");
const {
  Course,
  validateCreateCourse,
  validateUpdateCourse,
} = require("../../models/Course");
const {
  MyCourse,
  validateEnrollment,
  validateCategoryEnrollment,
} = require("../../models/MyCourse");
const { Chapter } = require("../../models/Chapter");
const { Lesson } = require("../../models/Lesson");
const { Category } = require("../../models/Category");
const { Language } = require("../../models/Language");
const { Level } = require("../../models/Level");
const { Image } = require("../../models/Image");
const { User } = require("../../models/User");

const {
  CourseReview,
  validateCourseReview,
} = require("../../models/CourseReview");
const {
  LastActivity,
  validateLastActivity,
} = require("../../models/LastActivity");

const { WatchedVideo } = require("../../models/WatchedVideo");
const moment = require("moment");

const { ADMIN, TEACHER, TEACHER_ASSISTANT } = userRoles;

// router.get("/fix_courses_slug", async (req, res) => {
//   const courses = await Course.find({});

//   courses.forEach(async (course) => {
//     // const cou = await Course.findById(course._id);
//     // cou.slug = `${course._id}`;
//     // await cou.save();
//     const cors = await Course.findOneAndUpdate(
//       { slug: `${course._id}` },
//       { new: true }
//     );

//     console.log("COURSE => " + cors._id + " " + cors.slug);
//   });

//   res.send("fixed");
// });

router.get("/get_enrollments", authorize(ADMIN), async (req, res) => {
  const enrollments = await MyCourse.find()
    .populate("course", "name category")
    .populate("user", "image email firstName lastName")
    .sort("-_id");

  res.sendApiResponse({ data: enrollments });
});

router.get("/my_course_activities", authorize(), async (req, res) => {
  const { user } = req.authSession;

  const myActivities = await LastActivity.find({ user: user._id }).populate(
    "lesson"
  );

  res.sendApiResponse({ data: myActivities });
});
router.get("/all_courses", async (req, res) => {
  const courses = await Course.find({ isDeleted: false, published: true }).sort(
    "name"
  );
  res.sendApiResponse({ data: courses });
});

router.get("/my_courses", authorize(), async (req, res) => {
  const { user } = req.authSession;
  const myCourses = await MyCourse.find({ user: user._id });

  const myCourseIds = myCourses.map((mc) => mc.course);

  const courses = await Course.find({
    _id: { $in: myCourseIds },
    isDeleted: false,
    published: true,
  }).sort("name");
  res.sendApiResponse({ data: courses });
});

router.get("/all_courses_for_dropdown", async (req, res) => {
  const courses = await Course.find({
    isDeleted: false,
  })
    .sort("name")
    .select("name price _id published");
  res.sendApiResponse({ data: courses });
});

router.get("/all_courses_list", authorize(ADMIN), async (req, res) => {
  const {
    draw = "1",
    search = { value: "" },
    start = 0,
    length = 10,
    order = [0, "_id"],
  } = req.query;

  const query = { isDeleted: false };

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
  const queryObj = Course.find(query)
    .skip(parseInt(start))
    .limit(parseInt(length))
    .sort("-_id")
    .select("_id name category published buyCount");

  const data = await queryObj;

  const recordsFiltered = await Course.find(query).count();
  const recordsTotal = await Course.find({ isDeleted: false }).count();

  const users = {
    draw,
    recordsTotal,
    recordsFiltered,
    data,
  };
  res.send(users);
});

router.get("/images/:id", async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id))
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Course ID.",
    });

  const images = await Image.find({ content: id }).sort("sortOrder");
  res.sendApiResponse({ data: images });
});

router.get("/course_instructor/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id))
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Course ID.",
    });

  const course = await Course.findById(id).select("instructors");
  if (!course)
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Course ID.",
    });

  const { instructors = [] } = course;

  const users = [];
  for (let i = 0; i < instructors.length; ++i) {
    const u = await User.findById(`${instructors[i]}`).select(
      "_id firstName lastName email image role"
    );
    if (u) users.push(u);
  }
  res.sendApiResponse({ data: users });
});

router.get("/reviews/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ message: "Invalid ID Passed", status: 400 });

  const reviews = await CourseReview.find({ course: id }).populate(
    "user",
    "firstName lastName email image"
  );

  res.sendApiResponse({ data: reviews });
});

router.get(
  "/full_course_detail/:identifier",
  authorizeIfUser(),
  async (req, res) => {
    const { identifier } = req.params;

    let user;
    if (req.authSession && req.authSession.user) user = req.authSession.user;

    let course;
    if (validateObjectId(identifier)) {
      course = await Course.findById(identifier);
    } else {
      course = await Course.findOne({
        slug: identifier,
      });
    }

    if (!course)
      return res.sendApiResponse({
        status: 400,
        message: "Invalid Course ID.",
      });

    // /getting chapters
    const chapters = await Chapter.find({
      published: true,
      course: course._id,
      isDeleted: false,
    }).sort("sortOrder");

    let isEnrolled = false;
    let enrolledChapters = [];
    let completeCourseEnrolled = false;
    let feedbackAsked = false;
    if (user) {
      if (user.role === ADMIN) {
        isEnrolled = true;
        enrolledChapters = chapters.map((c) => c._id);
        completeCourseEnrolled = true;
        feedbackAsked = true;
      } else if (user.role === TEACHER || user.role === TEACHER_ASSISTANT) {
        if (course.instructors.includes(user._id)) {
          isEnrolled = true;
          enrolledChapters = chapters.map((c) => c._id);
          completeCourseEnrolled = true;
        }

        // no matter which teacher or teacher assistant it is.
        feedbackAsked = true;
      } else {
        const currentTimeStamp = parseInt(moment().format("X")) || 0;

        const myCourse = await MyCourse.findOne({
          user: user._id,
          course: course._id,
          endDate: { $gte: currentTimeStamp },
        });

        if (myCourse) {
          feedbackAsked = myCourse.feedbackAsked;
          isEnrolled = true;
          completeCourseEnrolled = completeCourseEnrolled;
          myCourse.chapterEnrollments.map((ch) => {
            if (ch.endDate > currentTimeStamp) {
              enrolledChapters.push(ch.chapter);
            }
          });
        }
      }
    }

    const data = { ...course._doc };
    data.isEnrolled = isEnrolled;
    data.enrolledChapters = enrolledChapters;
    data.completeCourseEnrolled = completeCourseEnrolled;
    data.feedbackAsked = feedbackAsked;
    //getting images
    data.images = await Image.find({ content: course._id }).sort("sortOrder");

    //getting teachers
    const { instructors = [] } = course;
    data.teachers = [];
    for (let i = 0; i < instructors.length; ++i) {
      const t = await User.findOne({
        _id: `${instructors[i]}`,
        role: TEACHER,
      }).select(
        "_id firstName lastName email image introduction facebookLink twitterLink linkedInLink googleLink youtubeLink"
      );
      if (t) data.teachers.push(t);
    }

    // getting lessons of a chapter
    const chaptersWithLessons = [];
    for (let i = 0; i < chapters.length; ++i) {
      const chap = chapters[i];
      const lessons = await Lesson.find({
        published: true,
        isDeleted: false,
        chapter: chap._id,
      }).sort("sortOrder");

      chaptersWithLessons.push({ ...chap._doc, lessons });
    }
    data.watchedVideos = [];
    if (user) {
      data.watchedVideos = await WatchedVideo.find({
        user: user._id,
        course: course._id,
      });
    }
    data.chapters = chaptersWithLessons;

    res.sendApiResponse({ data });
  }
);

router.get(
  "/courses_assigned_to_teacher",
  authorize([TEACHER, TEACHER_ASSISTANT]),
  async (req, res) => {
    const { user } = req.authSession;

    const courses = await Course.find({
      isDeleted: false,
      published: true,
      instructors: user._id,
    }).sort("name");

    res.sendApiResponse({ data: courses });
  }
);

router.get("/get_enrollment/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Enrollment ID.",
    });

  const enrollment = await MyCourse.findById(id).populate("user", "email");
  if (!enrollment)
    return res.sendApiResponse({
      status: 404,
      message: "Enrollment not found",
    });

  res.sendApiResponse({ data: enrollment });
});

router.get("/:identifier", async (req, res) => {
  const { identifier } = req.params;

  // if (!validateObjectId(id))
  //   return res.sendApiResponse({
  //     status: 400,
  //     message: "Invalid Course ID.",
  //   });
  const course = await Course.findOne({
    $or: [{ _id: identifier }, { slug: identifier }],
  });
  if (!course)
    return res.sendApiResponse({ status: 404, message: "Course not found" });

  //getting all chapters
  const chapters = await Chapter.find({
    course: course._id,
    isDeleted: false,
  })

    .select("_id name")
    .sort("sortOrder");

  const courseObj = _.pick(course, [
    "_id",
    "name",
    "slug",
    "category",
    "price",
    "description",
    "lectures",
    "duration",
    "videoDuration",
    "skillLevel",
    "language",
    "published",
    "showReviews",
    "traits",
    "metaTitle",
    "metaDescription",
    "metaKeyWords",
  ]);
  courseObj.chapters = chapters;

  res.sendApiResponse({ data: courseObj });
});

router.post(
  "/create_category_enrollment",
  authorize(ADMIN),
  async (req, res) => {
    const { value, error } = validateCategoryEnrollment(req.body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    let { email, startDate, endDate } = value;

    startDate = parseInt(startDate);
    endDate = parseInt(endDate);

    const user = await User.findOne({ email });
    if (!user)
      return res.sendApiResponse({ status: 400, message: "User Not Found" });

    const categoryCourses = await Course.find({
      "category._id": value.category,
      published: true,
    });

    if (!categoryCourses)
      return res.sendApiResponse({ status: 400, message: "No Courses Found" });

    categoryCourses.forEach(async (course) => {
      const data = {
        course: course._id,
        completeCourse: true,
        user: user._id,
        startDate,
        endDate,
      };

      const courseChapters = await Chapter.find({
        course: course._id,
        isDeleted: false,
      }).sort("sortOrder");

      data.chapters = courseChapters.map((chap) => chap._id);

      data.chapterEnrollments = courseChapters.map((chap) => {
        return {
          chapter: chap._id,
          startDate,
          endDate,
        };
      });

      await MyCourse.findOneAndRemove({
        user: data.user,
        course: course._id,
      });
      await new MyCourse(data).save();
    });

    res.sendApiResponse({ message: "Enrolled" });
  }
);

router.post("/create_enrollment", authorize(ADMIN), async (req, res) => {
  const { value, error } = validateEnrollment(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { email } = value;

  const user = await User.findOne({ email });
  if (!user)
    return res.sendApiResponse({ status: 400, message: "User Not Found" });

  delete value.email;

  value.user = user._id;

  const currentDateTime = parseInt(moment().format("X"));

  if (value.completeCourse) {
    const endDate = moment().add("years", 1).format("X");

    const courseChapters = await Chapter.find({
      course: value.course,
      isDeleted: false,
    }).sort("sortOrder");
    value.chapters = courseChapters.map((chap) => chap._id);
    value.chapterEnrollments = courseChapters.map((chap) => {
      return {
        chapter: chap._id,
        startDate: currentDateTime,
        endDate,
      };
    });
    value.endDate = endDate;
  }

  value.chapters = value.chapterEnrollments.map((chap) => chap.course);

  const prevEnrollment = await MyCourse.findOne({
    user: value.user,
    course: value.course,
  });

  if (prevEnrollment)
    return res.sendApiResponse({ status: 400, message: "Already enrolled" });
  const enrollment = await new MyCourse(value).save();
  res.sendApiResponse({ data: enrollment });
});

router.put("/update_enrollment/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  const { value, error } = validateEnrollment(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { email } = value;

  delete value.email;

  // const currentDateTime = parseInt(moment().format("X"));

  // if (value.completeCourse) {
  //   const endDate = moment().add("years", 1).format("X");

  //   const courseChapters = await Chapter.find({
  //     course: value.course,
  //     isDeleted: false,
  //   }).sort("sortOrder");
  //   value.chapters = courseChapters.map((chap) => chap._id);
  //   value.chapterEnrollments = courseChapters.map((chap) => {
  //     return {
  //       chapter: chap._id,
  //       startDate: currentDateTime,
  //       endDate,
  //     };
  //   });
  //   value.endDate = endDate;
  // }

  const enrollment = await MyCourse.findByIdAndUpdate(
    id,
    {
      $set: value,
    },
    { new: true }
  );
  res.sendApiResponse({ data: enrollment });
});

router.post("/record_last_activity", authorize(), async (req, res) => {
  const { user } = req.authSession;

  const { value, error } = validateLastActivity(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  let activity = await LastActivity.findOne({
    user: user._id,
    course: value.course,
  });

  if (!activity)
    activity = await new LastActivity({ ...value, user: user._id }).save();
  else {
    activity.duration = value.duration;
    activity.lesson = value.lesson;
    await activity.save();
  }

  const lesson = await Lesson.findById(value.lesson);

  res.sendApiResponse({
    data: { ...activity._doc, lesson },
  });
});

router.post(
  "/add_course_image/:id",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid Course Id" });

    if (!req.file)
      return res.sendApiResponse({
        status: 400,
        message: "Image is required",
      });

    const course = await Course.findById(id);

    if (!course)
      return res.sendApiResponse({ status: 400, message: "Invalid Course Id" });

    const uniqueName = getFileName(req.file.originalname);
    const uploadResult = await fileStorage.uploadFile(
      "images/" + uniqueName,
      req.file.buffer
    );
    const image = await new Image({ image: uniqueName, content: id }).save();

    course.image = uploadResult.Location;
    await course.save();

    res.sendApiResponse({
      data: image,
    });
  }
);

router.post("/add_review/:id", authorize(), async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id))
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Course ID.",
    });

  const { value, error } = validateCourseReview(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const course = await Course.findById(id);
  if (!course)
    return res.sendApiResponse({ status: 404, message: "Course not found" });
  const { user } = req.authSession;

  const myCourse = await MyCourse.findOne({ user: user._id });
  if (!myCourse)
    return res.sendApiResponse({
      status: 400,
      message: "You are not enrolled in this course.",
    });

  const prevReview = await CourseReview.findOne({ user: user._id, course: id });

  let courseReview;
  if (prevReview) {
    course.ratingSum -= prevReview.rating;
    course.rateCount -= 1;
    course.totalRatingCount -= 1;

    switch (prevReview.rating) {
      case 1:
        course.oneStar = (course.oneStar || 1) - 1;
        break;
      case 2:
        course.twoStar = (course.twoStar || 1) - 1;
        break;
      case 3:
        course.threeStar = (course.threeStar || 1) - 1;
        break;
      case 4:
        course.fourStar = (course.fourStar || 1) - 1;
        break;
      case 5:
        course.fiveStar = (course.fiveStar || 1) - 1;
        break;
    }

    courseReview = await CourseReview.findByIdAndUpdate(
      prevReview._id,
      { $set: { ...value, createdAt: new Date() } },
      { new: true }
    );
  } else {
    courseReview = await new CourseReview({
      ...value,
      user: user._id,
      course: id,
      createdAt: new Date(),
    }).save();
  }

  course.ratingSum += value.rating;
  course.rateCount += 1;
  course.totalRatingCount += 1;
  course.rating = course.ratingSum / course.rateCount;

  switch (value.rating) {
    case 1:
      course.oneStar = (course.oneStar || 0) + 1;
      break;
    case 2:
      course.twoStar = (course.twoStar || 0) + 1;
      break;
    case 3:
      course.threeStar = (course.threeStar || 0) + 1;
      break;
    case 4:
      course.fourStar = (course.fourStar || 0) + 1;
      break;
    case 5:
      course.fiveStar = (course.fiveStar || 0) + 1;
      break;
  }
  await course.save();
  res.sendApiResponse({
    data: {
      courseReview: await CourseReview.findById(courseReview._id).populate(
        "user",
        "firstName lastName email image"
      ),
      course: _.pick(course, [
        "rating",
        "ratingSum",
        "rateCount",
        "totalRatingCount",
        "oneStar",
        "twoStar",
        "threeStar",
        "fourStar",
        "fiveStar",
      ]),
    },
  });
});

router.post(
  "/",
  authorize(ADMIN),
  async (req, res) => {
    // This route is to create a new Course.
    const { value, error } = validateCreateCourse(req.body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    const category = await Category.findById(value.category).select("_id name");
    if (!category)
      return res.sendApiResponse({ status: 400, message: "Invalid Category" });

    // var str = value.traits;

    // var traits = new Array();
    // traits = str.split(",");
    const courseObj = {
      name: value.name,
      category: {
        _id: category._id,
        name: category.name,
      },
      traits: value.traits,
      createdBy: req.authSession.user._id,
    };
    console.log(courseObj);
    const course = await new Course(courseObj).save();

    res.sendApiResponse({
      message: "Done !",
      data: course,
    });
  },
  fileExceptionHandler
);

router.put("/rearrange_images/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id))
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Course ID.",
    });

  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return Image.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  if (orderIds[0]) {
    const image = await Image.findById(orderIds[0]);
    if (image) {
      await Course.findByIdAndUpdate(id, { $set: { image: image.image } });
    }
  }
  res.sendApiResponse({ message: "Successfully Sorted!" });
});

router.put("/update_instructors/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ message: "Invalid ID Passed", status: 400 });
  const { value, error } = validateCreateCourse(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  await Course.findByIdAndUpdate(id, { $set: value });

  res.sendApiResponse({ message: "Instructors Updated" });
});

router.put("/publish/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Chapter Id" });

  let { published } = req.body;

  if (typeof published !== "boolean")
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Publish Property",
    });

  const chapter = await Course.findByIdAndUpdate(id, { $set: { published } });
  if (!chapter)
    return res.sendApiResponse({ status: 404, message: "Chapter Not Found" });

  res.sendApiResponse({
    message: published ? "Course Published" : "Course Unpublished",
  });
});

router.put("/feedback_asked/:id", authorize(), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ message: "Invalid ID Passed", status: 400 });
  const { user } = req.authSession;
  const myCourse = await MyCourse.findOneAndUpdate(
    {
      user: user._id,
      course: id,
    },
    {
      $set: {
        feedbackAsked: true,
      },
    },
    { new: true }
  );

  if (!myCourse)
    return res.sendApiResponse({ message: "Invalid ID Passed", status: 400 });

  res.sendApiResponse({ message: "feedbackAsked flag updated" });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ message: "Invalid ID Passed", status: 400 });

  const { value, error } = validateUpdateCourse(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  /// check if another course slug is available
  const category = await Category.findById(value.category);
  if (!category)
    return res.sendApiResponse({ status: 400, message: "Invalid Category" });
  value.category = category;

  const language = await Language.findById(value.language);
  if (!language)
    return res.sendApiResponse({ status: 400, message: "Invalid Language" });
  value.language = language;

  const level = await Level.findById(value.skillLevel);
  if (!level)
    return res.sendApiResponse({ status: 400, message: "Invalid Level" });
  value.skillLevel = level;

  const course = await Course.findByIdAndUpdate(id, value, { new: true });
  if (!course)
    return res.sendApiResponse({
      status: 404,
      message: "Course not found",
    });

  res.sendApiResponse({ data: course });
});

router.delete("/delete_image/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ message: "Invalid ID Passed", status: 400 });

  const image = await Image.findByIdAndDelete(id);
  res.sendApiResponse({ message: "Image deleted" });
});

router.delete("/delete_enrollment/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ message: "Invalid ID Passed", status: 400 });
  const enr = await MyCourse.findByIdAndDelete(id);

  return res.sendApiResponse({
    message: "Deleted Successfully.",
    data: enr,
  });
});

router.delete("/delete_review/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;

  if (!validateObjectId(id))
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Review ID.",
    });

  const review = await CourseReview.findById(id);
  const course = await Course.findById(review.course);

  switch (review.rating) {
    case 1:
      course.oneStar = (course.oneStar || 0) - 1;
      break;
    case 2:
      course.twoStar = (course.twoStar || 0) - 1;
      break;

    case 3:
      course.threeStar = (course.threeStar || 0) - 1;
      break;

    case 4:
      course.fourStar = (course.fourStar || 0) - 1;
      break;
    case 5:
      course.five = (course.five || 0) - 1;
      break;
  }

  course.ratingSum -= review.rating;
  course.rateCount -= 1;
  course.totalRatingCount -= 1;

  if (course.rateCount > 0) {
    course.rating = course.ratingSum / course.rateCount;
  } else {
    course.rating = 0;
  }

  await course.save();

  await CourseReview.findByIdAndDelete(review._id);

  res.sendApiResponse({ message: "Review Deleted" });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ message: "Invalid ID Passed", status: 400 });
  const course = await Course.findByIdAndUpdate(id, {
    $set: { isDeleted: true },
  });
  if (course)
    return res.sendApiResponse({
      message: "Deleted Successfully.",
      data: course,
    });
  return res.sendApiResponse({
    message: "Course not Found !!",
    status: 400,
  });
});

module.exports = router;
