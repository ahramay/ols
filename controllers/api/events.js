const express = require("express");
const router = express.Router();
const { authorize } = require("../../middlewares/authorization");
const { userRoles } = require("../../models/User");
const { Event, validateEvent } = require("../../models/Event");
const { validateObjectId } = require("../../helpers/validation");
const axios = require("axios");
const fileStorage = require("../../services/fileStorage");
const { imageUpload } = require("../../middlewares/upload");
const { getFileName } = require("../../helpers/file");
const { fileExceptionHandler } = require("../../middlewares/errors");
const jwt = require("jsonwebtoken");
const { ADMIN } = userRoles;

const ZOOM_API_KEY = "mFZkwAVUQTqIb41hT8cGYA";
const ZOOM_API_SECRET = "QcwN3o5VSkWA55trY73InU8BQ72PjM3lCva9";

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Language Id" });
  const event = await Event.findById(id);
  if (!event)
    return res.sendApiResponse({ status: 404, message: "Event not found" });
  res.sendApiResponse({ data: event });
});

router.get("/", async (req, res) => {
  const events = await Event.find({ isDeleted: false }).sort("-_id");
  // try {
  //   const zoomToken = createZoomJWT();
  //   const zoomUser = await getZoomUser(zoomToken);
  //   const zoomWebinar = await createZoomWebinar({
  //     token: zoomToken,
  //     userId: zoomUser.id,
  //     body: {
  //       topic: "Test Webinar",
  //       type: 5,
  //       start_time: "2020-09-20T06:59:00Z",
  //       duration: "60",
  //       timezone: "America/Los_Angeles",
  //       password: "avfhfgh",
  //       agenda: "Test Webinar",
  //       recurrence: {
  //         type: 1,
  //         repeat_interval: 1,
  //         end_date_time: "2020-09-22T06:59:00Z",
  //       },
  //       settings: {
  //         host_video: "true",
  //         panelists_video: "true",
  //         practice_session: "true",
  //         hd_video: "true",
  //         approval_type: 0,
  //         registration_type: 2,
  //         audio: "both",
  //         auto_recording: "none",
  //         enforce_login: "false",
  //         close_registration: "true",
  //         show_share_button: "true",
  //         allow_multiple_devices: "false",
  //         registrants_email_notification: "true",
  //       },
  //     },
  //   });
  // } catch (err) {
  //   console.log("Zoom Error =>", err.response.data);
  // }

  res.sendApiResponse({ data: events });
});

router.post(
  "/",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    delete req.body.image;
    const { value, error } = validateEvent(req.body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    if (req.file) {
      const uniqueName = getFileName(req.file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        req.file.buffer
      );
      value.image = uploadResult.Location;

      console.log("IMAGE UPLOAD =>", uploadResult.Location);
    }

    if (value.type === "webinar") {
      const jwtZoomToken = createZoomJWT();
      const zoomUsers = await getZoomUser(jwtZoomToken);
    }
    const event = await new Event(value).save();
    res.sendApiResponse({ data: event });
  },
  fileExceptionHandler
);

router.put(
  "/:id",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { id } = req.params;
    if (!validateObjectId(id))
      return res.sendApiResponse({
        status: 400,
        message: "Invalid Language Id",
      });

    delete req.body.image;
    const { value, error } = validateEvent(req.body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    if (req.file) {
      const uniqueName = getFileName(req.file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        req.file.buffer
      );
      value.image = uploadResult.Location;
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { $set: value },
      { new: true }
    );

    if (!event)
      return res.sendApiResponse({
        status: 404,
        message: "Language not found!",
      });

    res.sendApiResponse({ data: event });
  },
  fileExceptionHandler
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Language Id" });

  const language = await Event.findByIdAndUpdate(
    id,
    {
      $set: { isDeleted: true },
    },
    { new: true }
  );

  if (!language)
    return res.sendApiResponse({ status: 404, message: "Language not found!" });

  res.sendApiResponse({ data: language });
});

const createZoomJWT = () => {
  return jwt.sign(
    {
      iss: ZOOM_API_KEY,
      exp: Date.now() + 3600000,
    },
    ZOOM_API_SECRET
  );
};

module.exports = router;

const getZoomUser = async (token) => {
  const res = await axios.get("https://api.zoom.us/v2/users", {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return res.data.users[0];
};

const createZoomWebinar = async ({ token, userId, body }) => {
  const res = await axios.post(
    `https://api.zoom.us/v2/users/${userId}/webinars`,
    body,
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    }
  );

  console.log("res", res);
};
