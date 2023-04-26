const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const moment = require("moment");
const {
  User,
  userRoles,
  sanitizeUser,
  validateCreateUser,
  validateUpdateUser,
} = require("../../models/User");
const { authorize } = require("../../middlewares/authorization");
const { imageUpload } = require("../../middlewares/upload");
const { getFileName } = require("../../helpers/file");
const { validateObjectId } = require("../../helpers/validation");
const fileStorage = require("../../services/fileStorage");
const { capitalizeFirstLetter } = require("../../helpers/string");
const { ADMIN, TEACHER, TEACHER_ASSISTANT } = userRoles;

router.get("/instructors", authorize(ADMIN), async (req, res) => {
  let { search = "" } = req.query;
  search = search.trim();

  const query = {
    role: { $in: [TEACHER, TEACHER_ASSISTANT] },
  };
  if (search !== "") {
    const searchExpression = RegExp(`.*${search}.*`, "i");
    query.$or = [
      { firstName: searchExpression },
      { lastName: searchExpression },
      { email: searchExpression },
    ];
  }

  const instructors = await User.find(query)
    .limit(10)
    .select("_id firstName lastName email role");

  res.sendApiResponse({ data: instructors });
});

router.get("/:_id", authorize(ADMIN), async (req, res) => {
  const { _id } = req.params;
  const user = await User.findById(_id);
  if (!user) res.sendApiResponse({ status: 404, message: "User not Found" });
  res.sendApiResponse({ data: user });
});

router.get("/", authorize(ADMIN), async (req, res) => {
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
      { firstName: searchExp },
      { lastName: searchExp },
      { email: searchExp },
    ];
  }

  const columns = [
    "firstName",
    "lastName",
    "school",
    "dateOfBirth",
    "role",
    "phoneNumber",
    "email",
    "createdAt",
    "_id",
  ];

  const sortBy = {};

  order.forEach((o, index) => {
    const colName = columns[o.column];
    sortBy[colName] = o.dir === "desc" ? -1 : 1;
  });

  let data = await User.find(query)
    .skip(parseInt(start))
    .limit(parseInt(length))
    .sort(sortBy)
    .select(
      "_id firstName lastName dateOfBirth school phoneNumber email role createdAt emailVerified"
    );

  const recordsFiltered = await User.find(query).count();
  const recordsTotal = await User.find({}).count();

  data = data.map((d) => {
    d = d._doc;
    d.createdAt = d.createdAt || "INVALID DATE";
    return d;
  });
  const users = {
    draw,
    recordsTotal,
    recordsFiltered,
    data,
  };
  res.send(users);
});

router.post(
  "/create_user",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    const { value, error } = validateCreateUser(req.body);

    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    const { fullname, email, password } = value;

    //check if email already exists
    const previousUser = await User.findOne({ email });

    if (previousUser)
      return res.sendApiResponse({
        status: 400,
        message: "User with this Email is Already Registered",
      });

    const userData = {
      ...value,
      dateOfBirth: moment(value.dateOfBirth, "DD/MM/YYYY").toDate(),
      createdAt: new Date(),
    };

    if (req.file) {
      const uniqueName = getFileName(req.file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        req.file.buffer
      );

      userData.image = uploadResult.Location;
    }

    const user = new User(userData);

    user.firstName = capitalizeFirstLetter(user.firstName);
    user.lastName = capitalizeFirstLetter(user.lastName);

    //generating password hash
    const salt = await bcrypt.genSalt(10);
    user.emailVerified = true;
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.sendApiResponse({
      message: "User Created",
    });
  }
);

router.put(
  "/update_user/:userId",
  authorize(ADMIN),
  imageUpload.single("image"),
  async (req, res) => {
    console.log("idhr");
    const userId = req.params.userId;
    // console.log("i am here and watching")
    const user = await User.findById(userId);
    if (!user)
      return res.sendApiResponse({
        status: 400,
        message: "User Not Found !",
      });
    const { value, error } = validateUpdateUser(req.body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });
    const { password, confirmPassword } = value;

    if (password && (!confirmPassword || confirmPassword !== password))
      return res.sendApiResponse({
        status: 400,
        message: "Confirm Pasword Must be same as password",
      });

    const found = await User.findOne({ email: value.email });
    if (found && found._id.toHexString() !== user._id.toHexString())
      return res.sendApiResponse({
        status: 400,
        message: "This Email Already Exist.",
      });

    for (x in value) {
      if (value[x]) {
        if (x !== "password" && x !== "confirmPassword") user[x] = value[x];
      }
    }

    user.dateOfBirth = moment(value.dateOfBirth, "DD/MM/YYYY").toDate();

    if (req.file) {
      const uniqueName = getFileName(req.file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        req.file.buffer
      );

      user.image = uploadResult.Location;
    }

    user.firstName = capitalizeFirstLetter(user.firstName);
    user.lastName = capitalizeFirstLetter(user.lastName);

    if (value.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(value.password, salt);
    }
    await user.save();
    res.sendApiResponse({ message: "User Modified !", data: user });
  }
);

router.delete("/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ data: "Invalid User id" });

  const user = await User.findByIdAndDelete(id);
  if (!user)
    return res.sendApiResponse({ status: 404, message: "User not found" });

  res.sendApiResponse({ message: "User deleted successfully." });
});
module.exports = router;
