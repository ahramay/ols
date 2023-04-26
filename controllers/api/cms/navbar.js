const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");
const {
  NavBar,
  validateNavBar,
  validateNavBarUponUpdate,
} = require("../../../models/Navbar");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;

router.post(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;

    const { error, value } = validateNavBar(body);
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
    let navbar = await new NavBar(value).save();
    res.sendApiResponse({ data: navbar });
  },
  fileExceptionHandler
);

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let navbar = await NavBar.findById(id);
  if (!navbar)
    return res.sendApiResponse({
      status: 404,
      message: "NavBar with this ID does not exist!",
    });
  res.sendApiResponse({ data: navbar });
});

router.get("/", async (req, res) => {
  let navbars = await NavBar.find({}).sort("sortOrder");
  res.sendApiResponse({ data: navbars });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return NavBar.findByIdAndUpdate(id, { sortOrder: index });
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
    if (!mongoose.Types.ObjectId.isValid(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    const { file, body } = req;
    const { error, value } = validateNavBarUponUpdate(body);
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
    let navbar = await NavBar.findByIdAndUpdate(id, value, { new: true });
    if (!navbar)
      return res.sendApiResponse({
        status: 404,
        message: "NavBar with this ID does not exist!",
      });
    res.sendApiResponse({ data: navbar });
  }
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let navbar = await NavBar.findByIdAndDelete(id);
  if (!navbar)
    return res.sendApiResponse({
      status: 404,
      message: "NavBar with this ID does not exist!",
    });
  res.sendApiResponse({ data: navbar });
});

module.exports = router;
