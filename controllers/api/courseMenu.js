const express = require("express");

const { CourseMenu, validateCourseMenu } = require("../../models/CourseMenu");
const { authorize } = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");
const { ADMIN } = userRoles;
const { getFileName } = require("../../helpers/file");
const { imageUpload } = require("../../middlewares/upload");
const fileStorage = require("../../services/fileStorage");
const { fileExceptionHandler } = require("../../middlewares/errors");

const router = express.Router();
router.get("/", async (req, res) => {
  let subMenu = await CourseMenu.findOne({});
  if (!subMenu) {
    subMenu = await new CourseMenu({}).save();
  }
  res.sendApiResponse({ data: subMenu });
});

["oLevelImage", "satPrepImage", "aLevelImage", "promoImage"].forEach((key) => {
  router.put(
    `/${key}`,
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
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );

      let subMenu = await CourseMenu.findOneAndUpdate(
        {},
        { $set: { [key]: uploadResult.Location } },
        {
          new: true,
        }
      );
      res.sendApiResponse({ data: subMenu });
    },

    fileExceptionHandler
  );
});

router.put("/", authorize(ADMIN), async (req, res) => {
  const { error, value } = validateCourseMenu(req.body);

  if (error)
    res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  let subMenu = await CourseMenu.findOneAndUpdate({}, value, {
    new: true,
  });
  if (!subMenu) {
    subMenu = await new CourseMenu(value).save();
  }
  res.sendApiResponse({ data: subMenu });
});

module.exports = router;
