const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");
const {
  StudentStats,
  validateStudentStats,
} = require("../../../models/StudentStats");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.get("/", async (req, res) => {
  let studentStats = await StudentStats.findOne({});
  if (!studentStats)
    await new StudentStats({
      score: "94%",
      scoreText: "A*s & As in CAIE  May/Jun 21 & 22",
      rating: "4.95",
      ratingText: "Average User Rating*",
      ratingSubtext: "*[out of 5], 500+ respondents",
      partnership: "15+",
      partnershipText: "School Partnerships In Pakistan",
    }).save();
  res.sendApiResponse({ data: studentStats });
});

router.put(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;
    const { error, value } = validateStudentStats(body);
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
    let studentStats = await StudentStats.findOneAndUpdate({}, value, {
      new: true,
    });
    res.sendApiResponse({ data: studentStats });
  }
);

module.exports = router;
