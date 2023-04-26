const express = require("express");
const router = express.Router();

const { Chapter, validateChapter } = require("../../models/Chapter");
const { authorize } = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");
const { validateObjectId } = require("../../helpers/validation");

const { ADMIN } = userRoles;

router.post("/", authorize(ADMIN), async (req, res) => {
  const { value, error } = validateChapter(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const chapter = await new Chapter(value).save();
  res.sendApiResponse({ data: chapter });
});

router.get("/course/:course", authorize(ADMIN), async (req, res) => {
  const { course } = req.params;
  if (!validateObjectId(course))
    return res.sendApiResponse({ status: 400, message: "Invalid Course Id" });

  const chapters = await Chapter.find({ course, isDeleted: false }).sort(
    "sortOrder"
  );
  res.sendApiResponse({ data: chapters });
});
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Chapter Id" });

  const chapter = await Chapter.findById(id).populate("course", "name");
  if (!chapter)
    return res.sendApiResponse({ status: 404, message: "Chapter not found" });

  res.sendApiResponse({ data: chapter });
});

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return Chapter.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ message: "Successfully Sorted!" });
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

  const chapter = await Chapter.findByIdAndUpdate(id, { $set: { published } });
  if (!chapter)
    return res.sendApiResponse({ status: 404, message: "Chapter Not Found" });

  res.sendApiResponse({
    message: published ? "Chapter Published" : "Chapter Unpublished",
  });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Chapter Id" });

  const { value, error } = validateChapter(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const chapter = await Chapter.findByIdAndUpdate(
    id,
    { $set: value },
    { new: true }
  );
  if (!chapter)
    return res.sendApiResponse({ status: 404, message: "Chapter not found" });

  res.sendApiResponse({ data: chapter });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Chapter Id" });

  const chap = await Chapter.findByIdAndDelete(id);
  res.sendApiResponse({ message: "Chapter Deleted" });
});

module.exports = router;
