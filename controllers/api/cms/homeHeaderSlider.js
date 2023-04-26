const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const {
  HomeHeaderSlider,
  validateHomeHeaderSlider,
} = require("../../../models/HomeHeaderSlider");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");
const { validateObjectId } = require("../../../helpers/validation");

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
    const { error, value } = validateHomeHeaderSlider(body);
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
    let homeHeaderSlider = await new HomeHeaderSlider(value).save();
    res.sendApiResponse({ data: homeHeaderSlider });
  },
  fileExceptionHandler
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let homeHeaderSlider = await HomeHeaderSlider.findById(id);
  if (!homeHeaderSlider)
    return res.sendApiResponse({
      status: 404,
      message: "Home Header Slider with this ID does not exist!",
    });
  res.sendApiResponse({ data: homeHeaderSlider });
});

router.get("/", async (req, res) => {
  let homeHeaderSlider = await HomeHeaderSlider.find({}).sort("sortOrder");

  res.sendApiResponse({ data: homeHeaderSlider });
});

//mobileImage

["mobileImage"].forEach((key) => {
  router.put(
    `/:id/${key}`,
    authorize(ADMIN),
    imageUpload.single("image"),
    async (req, res) => {
      try {
        const { id } = req.params;
        if (!validateObjectId(id))
          return res.sendApiResponse({
            status: 400,
            message: "Invalid Plan Id",
          });

        const { file } = req;
        if (!file)
          return res.sendApiResponse({
            status: 400,
            message: "Please upload an image file.",
          });
        const uniqueName = getFileName(file.originalname);
        const uploadResult = await fileStorage.uploadFile(
          "images/" + uniqueName,
          file.buffer
        );

        let subPlan = await HomeHeaderSlider.findByIdAndUpdate(
          id,
          { $set: { [key]: uploadResult.Location } },
          {
            new: true,
          }
        );
        res.sendApiResponse({ data: subPlan });
      } catch (err) {
        console.log(err);
        throw err;
      }
    },
    fileExceptionHandler
  );
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return HomeHeaderSlider.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ data: "Successfully Sorted!" });
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
    const { error, value } = validateHomeHeaderSlider(body);
    if (error)
      res.sendApiResponse({
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
    let homeHeaderSlider = await HomeHeaderSlider.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!homeHeaderSlider)
      return res.sendApiResponse({
        status: 404,
        message: "Home Header Slider with this ID does not exist!",
      });
    res.sendApiResponse({ data: homeHeaderSlider });
  },
  fileExceptionHandler
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let homeHeaderSlider = await HomeHeaderSlider.findByIdAndDelete(id);
  if (!homeHeaderSlider)
    return res.sendApiResponse({
      status: 404,
      message: "Home Header Slider with this ID does not exist!",
    });
  res.sendApiResponse({ data: homeHeaderSlider });
});

module.exports = router;
