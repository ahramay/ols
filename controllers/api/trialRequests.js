const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const moment = require("moment");
const { authorize } = require("../../middlewares/authorization");
const { User, userRoles } = require("../../models/User");
const {
  TrialRequest,
  validateTrialRequest,
} = require("../../models/TrialRequest");
const { AuthSession } = require("../../models/AuthSession");
const { validateObjectId } = require("../../helpers/validation");
const { capitalizeFirstLetter } = require("../../helpers/string");

const { ADMIN } = userRoles;

router.get("/data_table", authorize(ADMIN), async (req, res) => {
  const {
    draw = "1",
    search = { value: "" },
    start = 0,
    length = 10,
    order = [0, "_id"],
  } = req.query;

  const query = {
    isDeleted: false,
  };

  search.value = search.value.trim();

  if (search.value !== "") {
    const searchExp = RegExp(`.*${search.value}.*`, "i");
    query.name = searchExp;
  }

  const orderColumn = "createdAt";
  const sortBy = {};
  if (order[0] === parseInt(0) && order[1] === "_id") {
    sortBy[orderColumn] = -1;
  }
  const queryObj = TrialRequest.find(query)

    .skip(parseInt(start))
    .limit(parseInt(length))
    .sort("-createdAt");

  const data = await queryObj;

  const recordsFiltered = await TrialRequest.find(query).count();
  const recordsTotal = await TrialRequest.find({ isDeleted: false }).count();

  const languages = {
    draw,
    recordsTotal,
    recordsFiltered,
    data,
  };
  res.send(languages);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Language Id" });
  const language = await TrialRequest.findById(id);
  if (!language)
    return res.sendApiResponse({ status: 404, message: "Language not found" });
  res.sendApiResponse({ data: language });
});

router.get("/", async (req, res) => {
  const language = await TrialRequest.find({ isDeleted: false });
  res.sendApiResponse({ data: language });
});

router.post("/", async (req, res) => {
  const { value, error } = validateTrialRequest(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  const { firstName, lastName, category, phoneNumber, email, password } = value;
  const previousTrial = await TrialRequest.findOne({ email });
  if (previousTrial) {
    return res.sendApiResponse({ message: "Trial is already redeemed." });
  }
  const trial = await new TrialRequest({
    firstName,
    lastName,
    category,
    email,
    phoneNumber,
  }).save();
  const previousUser = await User.findOne({ email });
  if (!previousUser) {
    var user = new User({
      ...value,
      createdAt: new Date(),
    });

    //generating password hash
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //generating email verification code
    user.emailVerificationCode = user.generateEmailVerificationCode();
    user.emailVerified = true;
    user.firstName = capitalizeFirstLetter(user.firstName);
    user.lastName = capitalizeFirstLetter(user.lastName);

    await user.save();
    createUserSession(res, user);
  }
  return res.sendApiResponse({ data: { trial, user } });
});

router.put("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Language Id" });

  const {
    value: { name, parent },
    error,
  } = validateTrialRequest(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  const data = { name, parent };
  if (!parent) data.parent = null;

  const language = await TrialRequest.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true }
  );

  if (!language)
    return res.sendApiResponse({ status: 404, message: "Language not found!" });

  res.sendApiResponse({ data: language });
});

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Language Id" });

  const language = await TrialRequest.findByIdAndUpdate(
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

const createUserSession = async (res, user) => {
  const userSession = await new AuthSession({
    user: user._id,
    createdAt: new Date(),
  }).save();

  const sessionToken = userSession.generateToken();
  res
    .header("x-auth-token", sessionToken)
    .header("Access-Control-Expose-Headers", "x-auth-token");
};

module.exports = router;
