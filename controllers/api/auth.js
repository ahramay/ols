const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const axios = require("axios");
const moment = require("moment");
const {
  User,
  accountCreationType,
  userRoles,
  sanitizeUser,
  validateSignup,
  validateLoginWithFacebook,
  validateSignin,
  validateLoginWithGoogle,
  validateVerificationCode,
  validateEmail,
  validatePasswordReset,
  validateChangePassword,
  validateEmailAndResetCode,
  validateUpdateProfile,
} = require("../../models/User");
const { capitalizeFirstLetter } = require("../../helpers/string");
const { AuthSession } = require("../../models/AuthSession");
const { authorize } = require("../../middlewares/authorization");
const { imageUpload } = require("../../middlewares/upload");
const { getFileName } = require("../../helpers/file");
const { validateObjectId } = require("../../helpers/validation");
const fileStorage = require("../../services/fileStorage");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../../services/mailer");

const { ADMIN } = userRoles;
//signup route

router.get("/me", authorize(), (req, res) => {
  const { user } = req.authSession;
  res.sendApiResponse({ data: sanitizeUser(user) });
});
router.post("/signup", async (req, res) => {
  const { value, error } = validateSignup(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { email, password } = value;
  //check if email already exists
  const previousUser = await User.findOne({ email });
  if (previousUser)
    return res.sendApiResponse({
      status: 400,
      message: "Email Already Registered",
    });

  const user = new User({
    ...value,
    dateOfBirth: moment(value.dateOfBirth, "DD/MM/YYYY").toDate(),
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

  //send verifiation email
  // const { base_url } = req;
  // await sendVerificationEmail({
  //   to: user.email,
  //   verificationCode: user.emailVerificationCode,
  //   logoImage: base_url + "/images/logo.png",
  // });
  createUserSession(res, user);
});

router.post("/resend_verification_email", authorize(), async (req, res) => {
  const { user } = req.authSession;

  let code = user.emailVerificationCode;
  if (!code) {
    user.emailVerificationCode = user.generateEmailVerificationCode();
    await user.save();
    code = user.emailVerificationCode;
  }

  const { base_url } = req;
  await sendVerificationEmail({
    to: user.email,
    verificationCode: code,
    logoImage: base_url + "/images/logo.png",
  });

  res.sendApiResponse({ message: "Email Sent" });
});

router.post("/signin", async (req, res) => {
  const { admin = "0" } = req.query;
  const { value, error } = validateSignin(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { email, password } = value;

  const userQuery = { email };
  if (admin === "1") userQuery.role = userRoles.ADMIN;
  const user = await User.findOne(userQuery);

  if (!user || !user.password)
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Email or Password",
    });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword)
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Email or Password",
    });

  if (process.env.NODE_ENV !== "development") await expirePreviousSession(user);

  createUserSession(res, user);
});

router.delete("/signout", authorize(), async (req, res) => {
  const { authSession } = req;
  await AuthSession.findOneAndUpdate(
    { _id: authSession._id },
    { $set: { isExpired: true, expiredAt: new Date() } }
  );
  res.sendApiResponse({ message: "Signed out successfully" });
});

// Facebook login is here....
router.post("/signin_with_facebook", async (req, res) => {
  const { value, error } = validateLoginWithFacebook(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { accessToken, userID } = value;

  const tokenVerificationRes = await axios.get(
    `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
  );

  let { id, name, email, picture } = tokenVerificationRes.data;
  email = email.toLowerCase(); // Safety check if someday facebook makes his mind to change the cases.

  if (!email)
    return res.sendApiResponse({
      status: 400,
      message: "Cannot login without email.",
    });
  let [firstName, lastName] = name.split(" ");
  firstName = capitalizeFirstLetter(firstName);
  lastName = capitalizeFirstLetter(lastName);

  if (userID !== id)
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Access token",
    });

  let user = await User.findOne({ email });

  if (!user) {
    const userData = {
      firstName,
      lastName,
      email,
      image: picture.data.url,
      facebookAccessToken: accessToken,
      emailVerified: true,
      createdAt: new Date(),
      createdWith: accountCreationType.FACEBOOK,
    };
    user = await new User(userData).save();
  } else if (user.facebookId != id) {
    user.facebookId = id;
    user.facebookAccessToken = accessToken;
    await user.save();
  }

  createUserSession(res, user);
});

// Google login is here ....
router.post("/signin_with_google", async (req, res) => {
  const { value, error } = validateLoginWithGoogle(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });
  const { accessToken, googleId } = value;
  const tokenVerificationRes = await axios.get(
    `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`
  );

  let { id, email, given_name, family_name, picture } =
    tokenVerificationRes.data;
  email = email.toLowerCase(); //safety check....

  if (id !== googleId)
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Access Token",
    });

  let user = await User.findOne({ email });

  if (!user) {
    const userData = {
      firstName: given_name,
      lastName: family_name,
      image: picture,
      email,
      googleAccessToken: accessToken,
      emailVerified: true,
      createdAt: new Date(),
      createdWith: accountCreationType.GOOGLE,
      googleId: id,
    };
    user = await new User(userData).save();
  } else if (user.googleId !== id) {
    user.googleId = id;
    user.googleAccessToken = accessToken;
    await user.save();
  }

  createUserSession(res, user);
});

router.post(
  "/create_user_session/:userId",
  authorize(ADMIN),
  async (req, res) => {
    const { userId } = req.params;
    const requestedUser = await User.findOne({ _id: userId });
    if (!requestedUser) return res.status(400).send("Invalid User Id");
    createUserSession(res, requestedUser);
  }
);

router.put("/verify_email", authorize(), async (req, res) => {
  const { value, error } = validateVerificationCode(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { user } = req.authSession;

  if (user.emailVerificationCode !== value.verificationCode)
    return res.sendApiResponse({
      status: 400,
      message: "Invalid verification code.",
    });

  await User.findOneAndUpdate(
    { _id: user._id },
    { $set: { emailVerified: true, emailVerificationCode: "" } }
  );

  res.sendApiResponse({ message: "your email is verified." });
});

router.post("/request_password_reset", async (req, res) => {
  const { value, error } = validateEmail(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { email } = value;
  //check if email already exists
  const user = await User.findOne({ email });

  if (!user)
    return res.sendApiResponse({ status: 404, message: "User not found!" });

  user.passwordResetCode = user.generatePasswordResetCode();
  await user.save();

  //send email to user with code
  const { base_url } = req;
  sendPasswordResetEmail({
    to: user.email,
    resetCode: user.passwordResetCode,
    logoImage: base_url + "/images/logo.png",
  });
  res.sendApiResponse({
    message: "Password reset code has been sent to your email.",
  });
});

router.post("/resend_password_reset_email", async (req, res) => {
  const { value, error } = validateEmail(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const user = await User.findOne({ email: value.email });

  if (!user)
    return res.sendApiResponse({
      status: 400,
      message: "Invalid User request",
    });
  let code = user.passwordResetCode;
  //
  if (!code) {
    user.passwordResetCode = user.generatePasswordResetCode();
    await user.save();
    code = user.passwordResetCode;
  }

  const { base_url } = req;
  await sendVerificationEmail({
    to: user.email,
    verificationCode: code,
    logoImage: base_url + "/images/logo.png",
  });

  res.sendApiResponse({ message: "Email Sent" });
});

router.post("/password_reset_code_verification", async (req, res) => {
  const { value, error } = validateEmailAndResetCode(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { email, resetCode } = value;
  const user = await User.findOne({ email });
  if (!user) res.sendApiResponse({ status: 400, message: "Invalid Code" });

  if (user.passwordResetCode !== resetCode)
    res.sendApiResponse({ status: 400, message: "Invalid Code" });

  res.sendApiResponse({ message: "OK!" });
});

router.put("/reset_password", async (req, res) => {
  const { value, error } = validatePasswordReset(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  const { email, password, verificationCode } = value;
  //check if email already exists

  const user = await User.findOne({ email });

  if (!user)
    return res.sendApiResponse({
      status: 400,
      message: "Invalid Email or Password",
    });

  if (user.passwordResetCode !== verificationCode)
    return res.sendApiResponse({
      status: 400,
      message: "Invalid reset code.",
    });

  //generating password hash
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  user.passwordResetCode = "";

  await user.save();
  res.sendApiResponse({ message: "password reset successful" });
});

router.put(
  "/change_password",
  authorize("", { verifiedEmail: true }),
  async (req, res) => {
    const { value, error } = validateChangePassword(req.body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    const { user } = req.authSession;
    const { previousPassword, password } = value;

    const validPassword = await bcrypt.compare(previousPassword, user.password);
    if (!validPassword)
      return res.sendApiResponse({
        status: 400,
        message: "Invalid Password",
      });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.save();

    res.sendApiResponse({ message: "Password Changed Successfully" });
  }
);

router.put(
  "/update_profile",
  authorize(),
  imageUpload.single("image"),
  async (req, res) => {
    const { value, error } = validateUpdateProfile(req.body);
    if (error)
      return res.sendApiResponse({
        status: 400,
        message: error.details[0].message,
      });

    const { user } = req.authSession;
    const {
      firstName,
      lastName,
      phoneNumber,
      email,

      school,
      password,

      introduction,
      facebookLink,
      twitterLink,
      linkedInLink,
      googleLink,
      youtubeLink,
    } = value;

    const data = {
      firstName,
      lastName,
      phoneNumber,
      email,
      school,
      introduction,
      facebookLink,
      twitterLink,
      linkedInLink,
      googleLink,
      youtubeLink,
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(password, salt);
    }

    if (req.file) {
      const uniqueName = getFileName(req.file.originalname);
      const uploadResult = await fileStorage.uploadFile(
        "images/" + uniqueName,
        req.file.buffer
      );

      data.image = uploadResult.Location;
    }

    data.dateOfBirth = moment(value.dateOfBirth, "DD/MM/YYYY").toDate();

    data.firstName = capitalizeFirstLetter(data.firstName);
    data.lastName = capitalizeFirstLetter(data.lastName);
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { $set: data },
      { new: true }
    );
    res.sendApiResponse({ data: sanitizeUser(updatedUser) });
  }
);

const createUserSession = async (res, user) => {
  const userSession = await new AuthSession({
    user: user._id,
    createdAt: new Date(),
  }).save();

  const sessionToken = userSession.generateToken();
  res
    .header("x-auth-token", sessionToken)
    .header("Access-Control-Expose-Headers", "x-auth-token");
  res.sendApiResponse({ data: sanitizeUser(user) });
};

const expirePreviousSession = async (user) => {
  await AuthSession.deleteMany({
    user: user._id,
  });
};
module.exports = router;
