const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  StudentReviewsSlider,
  validateStudentReviewsSlider,
} = require("../../../models/StudentReviewsSlider");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");

router.post(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;
    if (!file)
      return res.sendApiResponse({
        status: 400,
        message: "Please upload an image file.",
      });
    const uniqueName = getFileName(file.originalname);
    const { error, value } = validateStudentReviewsSlider(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });
    const uploadResult = await fileStorage.uploadFile(
      "images/" + uniqueName,
      file.buffer
    );
    value.image = uploadResult.Location;
    let studentReviewsSlider = await new StudentReviewsSlider(value).save();
    res.sendApiResponse({ data: studentReviewsSlider });
  },
  fileExceptionHandler
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let studentReviewsSlider = await StudentReviewsSlider.findById(id);
  if (!studentReviewsSlider)
    return res.sendApiResponse({
      status: 404,
      message: "Student Reviews Slider with this ID does not exist!",
    });
  res.sendApiResponse({ data: studentReviewsSlider });
});

router.get("/", async (req, res) => {
  let studentReviewsSlider = await StudentReviewsSlider.find({}).sort(
    "sortOrder"
  );

  res.sendApiResponse({ data: studentReviewsSlider });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return StudentReviewsSlider.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ message: "Successfully Sorted!" });
});

router.put(
  "/:id",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const { file, body } = req;
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    const { error, value } = validateStudentReviewsSlider(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });
    if (file) {
      const uniqueName = getFileName(file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );
      value.image = uploadResult.Location;
    }
    let studentReviewsSlider = await StudentReviewsSlider.findByIdAndUpdate(
      id,
      value,
      {
        new: true,
      }
    );
    if (!studentReviewsSlider)
      return res.sendApiResponse({
        status: 404,
        message: "Student Reviews Slider with this ID does not exist!",
      });
    res.sendApiResponse({ data: studentReviewsSlider });
  },
  fileExceptionHandler
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let studentReviewsSlider = await StudentReviewsSlider.findByIdAndDelete(id);
  if (!studentReviewsSlider)
    return res.sendApiResponse({
      status: 404,
      message: "Student Reviews Slider with this ID does not exist!",
    });
  res.sendApiResponse({ data: studentReviewsSlider });
});

module.exports = router;
