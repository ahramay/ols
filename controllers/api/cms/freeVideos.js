const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  FreeVideo,
  validateCreateFreeVideo,
  validateUpdateFreeVideo,
} = require("../../../models/FreeVideo");
const { imageUpload } = require("../../../middlewares/upload");
const { validateObjectId } = require("../../../helpers/validation");
const {
  authorize,
  authorizeIfUser,
} = require("../../../middlewares/authorization");
const { userRoles } = require("../../../models/User");
const { getFileName } = require("../../../helpers/file");

const _ = require("lodash");
const fileStorage = require("../../../services/fileStorage");
const { ADMIN } = userRoles;
const { fileExceptionHandler } = require("../../../middlewares/errors");

router.post(
  "/create_free_video",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { value, error } = validateCreateFreeVideo(req.body);

    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    //extract video id from link to save
    var str = value.videoLink;
    var n = str.indexOf("=");
    var end;
    if (str.indexOf("&") > 0) {
      end = str.indexOf("&");
    } else {
      end = str.length;
    }
    const videoId = str.substr(n + 1, end);

    const freeVideo = await new FreeVideo({
      ...value,
      videoId,
      createdAt: new Date(),
    }).save();

    res.sendApiResponse({
      data: freeVideo,
    });
  },
  fileExceptionHandler
);

router.get("/all_free_videos", async (req, res) => {
  const allVideos = await FreeVideo.find({})
    .populate("category")
    .sort("sortOrder");
  res.sendApiResponse({ data: allVideos });
});

router.get("/data_table", authorize(ADMIN), async (req, res) => {
  const {
    draw = "1",
    search = { value: "" },
    start = 0,
    length = 10,
    order = [],
  } = req.query;

  const query = {};

  search.value = search.value.trim();

  if (search.value !== "") {
    const searchExp = RegExp(`.*${search.value}.*`, "i");
    query.$or = [
      { videoTitle: searchExp },
      // { lastName: searchExp },
      // { email: searchExp },
    ];
  }

  const columns = ["videoTitle", "videoId", "description"];

  const sortBy = {};

  order.forEach((o, index) => {
    const colName = columns[o.column];
    sortBy[colName] = o.dir === "desc" ? -1 : 1;
  });

  let data = await FreeVideo.find(query)
    .skip(parseInt(start))
    .limit(parseInt(length))
    .sort(sortBy)
    .select("_id videoTitle videoId description createdAt published");

  const recordsFiltered = await FreeVideo.find(query).count();
  const recordsTotal = await FreeVideo.find({}).count();

  res.send({
    draw,
    recordsTotal,
    recordsFiltered,
    data,
  });
});

router.get("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  const video = await FreeVideo.findById(id);
  if (!video) res.sendApiResponse({ status: 404, message: "video not Found" });
  res.sendApiResponse({ data: video });
});

router.put(
  "/update_video/:id",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { id } = req.params;

    const videoFound = await FreeVideo.findById(id);

    if (!videoFound)
      return res.sendApiResponse({
        status: 400,
        message: "Video Not Found !",
      });

    const { value, error } = validateUpdateFreeVideo(req.body);

    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    //extract video id from link to save
    var str = value.videoLink;
    var n = str.indexOf("=");
    var end;
    if (str.indexOf("&") > 0) {
      end = str.indexOf("&");
    } else {
      end = str.length;
    }

    var videoId = str.substr(n + 1, end);

    const video = {
      ...value,
      videoId,
      createdAt: new Date(),
    };

    if (req.file) {
      const uniqueName = getFileName(req.file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        req.file.buffer
      );

      video.thumbnail = uploadResult.Location;
    }
    const updatedVideo = await FreeVideo.findByIdAndUpdate(
      id,
      {
        $set: video,
      },
      { new: true }
    );

    res.sendApiResponse({
      data: updatedVideo,
    });
  },
  fileExceptionHandler
);

router.put("/rearrange", authorize(ADMIN), async (req, res) => {
  const { orderIds } = req.body;
  let newArr = orderIds.map((id, index) => {
    if (!validateObjectId(id))
      return res.sendApiResponse({ status: 400, message: "Invalid ID!" });
    return FreeVideo.findByIdAndUpdate(id, { sortOrder: index });
  });
  await Promise.all(newArr);
  res.sendApiResponse({ message: "Successfully Sorted!" });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ data: "Invalid User id" });

  const ocVideo = await FreeVideo.findByIdAndDelete(id);
  if (!ocVideo)
    return res.sendApiResponse({ status: 404, message: "User not found" });

  res.sendApiResponse({ message: "User deleted successfully!" });
});

module.exports = router;
