const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const slugify = require("slugify");
const {
  GenreicPages,
  validateGenreicPages,
  validateGenreicPagesUponUpdate,
} = require("../../../models/GenericPages");
const { authorize } = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { ADMIN } = userRoles;
const { getFileName } = require("../../../helpers/file");
const { imageUpload } = require("../../../middlewares/upload");
const fileStorage = require("../../../services/fileStorage");
const { fileExceptionHandler } = require("../../../middlewares/errors");
const _ = require("lodash");
router.post(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { file, body } = req;
    const { user } = req.authSession;
    const { error, value } = validateGenreicPages(body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    const data = _.pick(value, [
      "title",
      "slug",
      "content",
      "type",
      "category",
      "isActive",
      "metaTitle",
      "metaDescription",
      "metaKeyWords",
    ]);
    if (file) {
      const uniqueName = getFileName(file.originalname);

      const storageResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        file.buffer
      );
      data.image = storageResult.Location;
    }

    data.createdBy = user._id;
    data.createdAt = new Date();

    const prevPage = await GenreicPages.findOne({
      slug: data.slug,
      isDeleted: false,
    });

    if (prevPage)
      res.sendApiResponse({
        status: 400,
        message: "Page already exist with this title",
      });

    if (!data.category) {
      delete data.category;
    }
    let genericPage = await new GenreicPages(data).save();

    res.sendApiResponse({ data: genericPage });
  },
  fileExceptionHandler
);

router.get("/slug/:slug", async (req, res) => {
  const { slug } = req.params;

  let genericPage = await GenreicPages.findOne({
    slug,
    isActive: true,
    isDeleted: false,
  }).populate("createdBy", "firstName lastName image");
  if (!genericPage)
    return res.sendApiResponse({
      status: 404,
      message: "Page does not exist!",
    });
  res.sendApiResponse({ data: genericPage });
});

router.get("/recent_blogs/:slug", async (req, res) => {
  const { slug } = req.params;

  const blogs = await GenreicPages.find({
    type: "blog",
    isDeleted: false,
    slug: { $ne: slug },
  })
    .sort("-_id")
    .limit(3);

  res.sendApiResponse({ data: blogs });
});
router.get("/get_blogs", async (req, res) => {
  const blogs = await GenreicPages.find({
    isDeleted: false,
    type: "blog",
  }).populate("createdBy", "firstName lastName image");

  res.sendApiResponse({ data: blogs });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let genericPage = await GenreicPages.findById(id);
  if (!genericPage)
    return res.sendApiResponse({
      status: 404,
      message: "GenericPage with this ID does not exist!",
    });

  res.sendApiResponse({ data: genericPage });
});

router.get("/", authorize(ADMIN), async (req, res) => {
  let genericPage = await GenreicPages.find({ isDeleted: false }).select(
    "title type isActive slug"
  );

  res.sendApiResponse({ data: genericPage });
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
    const { error, value } = validateGenreicPagesUponUpdate(body);
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

    const prevPage = await GenreicPages.findOne({
      slug: value.slug,
      isDeleted: false,
    });
    if (prevPage && `${prevPage._id}` !== id)
      return res.sendApiResponse({
        status: 400,
        message: "Page already exist with this title",
      });

    if (!value.category || value.category == "undefined") {
      delete value.category;
    }
    let genericPage = await GenreicPages.findByIdAndUpdate(id, value, {
      new: true,
    });
    if (!genericPage)
      return res.sendApiResponse({
        status: 404,
        message: "GenericPage with this ID does not exist!",
      });
    res.sendApiResponse({ data: genericPage });
  },
  fileExceptionHandler
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
  let genericPage = await GenreicPages.findByIdAndUpdate(id, {
    $set: { isDeleted: true },
  });
  if (!genericPage)
    return res.sendApiResponse({
      status: 404,
      message: "GenericPage with this ID does not exist!",
    });
  res.sendApiResponse({ data: genericPage });
});

module.exports = router;
