const express = require("express");
const router = express.Router();

const { Question, validateQuestion } = require("../../models/Question");
const { validateObjectId } = require("../../helpers/validation");
const { authorize } = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");

const { fileExceptionHandler } = require("../../middlewares/errors");
const { imageUpload } = require("../../middlewares/upload");
const { getFileName } = require("../../helpers/file");
const fileStorage = require("../../services/fileStorage");

const { ADMIN } = userRoles;

router.post("/", authorize(ADMIN), async (req, res) => {
  const { value, error } = validateQuestion(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const question = await new Question(value).save();
  res.sendApiResponse({ data: question });
});

router.get("/quiz/:quiz", authorize(ADMIN), async (req, res) => {
  const { quiz } = req.params;
  if (!validateObjectId(quiz))
    return res.sendApiResponse({ status: 400, message: "Invalid quiz Id" });

  const questions = await Question.find({ quiz, isDeleted: false }).sort(
    "sortOrder"
  );
  res.sendApiResponse({ data: questions });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

  const quiz = await Question.findById(id).populate("lesson", "name");
  if (!quiz)
    return res.sendApiResponse({ status: 404, message: "quiz Not Found" });

  res.sendApiResponse({ data: quiz });
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

  const lesson = await Question.findByIdAndUpdate(id, { $set: { published } });
  if (!lesson)
    return res.sendApiResponse({ status: 404, message: "Lesson Not Found" });

  res.sendApiResponse({
    message: published ? "Lesson Published" : "Lesson Unpublished",
  });
});

router.put(
  "/set_image/:id",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

    const { file } = req;
    const updateData = {};
    if (file) {
      const uniqueName = getFileName(req.file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        req.file.buffer
      );
      updateData.image = uniqueName;
    } else {
      updateData.image = "";
    }
    const question = await Question.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    console.log(question);
    res.sendApiResponse({ data: question });
  },
  fileExceptionHandler
);
router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return Question.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ message: "Successfully Sorted!" });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Lesson Id" });

  const { value, error } = validateQuestion(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const lesson = await Question.findByIdAndUpdate(
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

  const lesson = await Question.findByIdAndUpdate(id, {
    $set: { isDeleted: true },
  });
  if (!lesson)
    return res.sendApiResponse({ status: 404, message: "Lesson Not Found" });

  res.sendApiResponse({ message: "Lesson Deleted" });
});
module.exports = router;
