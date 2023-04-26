const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  TestimonialSlider,
  validateTestimonialSlider,
} = require("../../../models/TestimonialSlider");
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

    const { error, value } = validateTestimonialSlider(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });
    const uniqueName = getFileName(file.originalname);
    const uploadResult = await fileStorage.uploadFile(
      "images/" + uniqueName,
      file.buffer
    );
    value.image = uploadResult.Location;
    let testimonialSlider = await new TestimonialSlider(value).save();
    res.sendApiResponse({ data: testimonialSlider });
  },
  fileExceptionHandler
);

router.get("/course/:id", async (req, res) => {
  const { id } = req.params;

  let testimonials = await TestimonialSlider.find({ course: id }).sort(
    "sortOrder"
  );
  res.sendApiResponse({ data: testimonials });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let testimonialSlider = await TestimonialSlider.findById(id);
  if (!testimonialSlider)
    return res.sendApiResponse({
      status: 404,
      message: "Testimonial Slider with this ID does not exist!",
    });
  res.sendApiResponse({ data: testimonialSlider });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;

  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });

    return TestimonialSlider.findByIdAndUpdate(id, { sortOrder: index });
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
    const { error, value } = validateTestimonialSlider(body);
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
    let testimonialSlider = await TestimonialSlider.findByIdAndUpdate(
      id,
      value,
      {
        new: true,
      }
    );
    if (!testimonialSlider)
      return res.sendApiResponse({
        status: 404,
        message: "Student Reviews Slider with this ID does not exist!",
      });
    res.sendApiResponse({ data: testimonialSlider });
  },
  fileExceptionHandler
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let testimonialSlider = await TestimonialSlider.findByIdAndDelete(id);
  if (!testimonialSlider)
    return res.sendApiResponse({
      status: 404,
      message: "Student Reviews Slider with this ID does not exist!",
    });
  res.sendApiResponse({ data: testimonialSlider });
});

router.get("/", async (req, res) => {
  let testimonialSlider = await TestimonialSlider.find({}).sort("sortOrder");
  res.sendApiResponse({ data: testimonialSlider });
});

module.exports = router;
