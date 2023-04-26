const mongoose = require("mongoose");
const Joi = require("joi");

const config = require("config");
const { boolean } = require("joi");
const mediaPath = config.get("mediaPath");

const userRoles = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  TEACHER_ASSISTANT: "TEACHER_ASSISTANT",
  ADMIN: "ADMIN",
};
const userCategories = {
  OLevel: "OLevel",
  Inter: "Inter",
  TEACHER_ASSISTANT: "TEACHER_ASSISTANT",
  ADMIN: "ADMIN",
};
const accountCreationType = {
  FACEBOOK: "facebook",
  GOOGLE: "google",
  DEFAULT: "default",
};

const sanitizeUser = (user = {}) => {
  const publicUserFields = [
    "_id",
    "firstName",
    "lastName",
    "email",
    "image",
    "phoneNumber",
    "dateOfBirth",
    "school",
    "role",
    "emailVerified",
    "introduction",
    "facebookLink",
    "twitterLink",
    "linkedInLink",
    "googleLink",
    "youtubeLink",
  ];
  const sanitized = {};
  for (let i = 0; i < publicUserFields.length; ++i) {
    const field = publicUserFields[i];
    if (user[field]) sanitized[field] = user[field];
  }
  return sanitized;
};

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    index: true,
  },
  phoneNumber: {
    type: String,
  },
  dateOfBirth: {
    type: Date,
  },
  school: {
    type: String,
  },
  image: {
    type: String,
  },
  introduction: {
    type: String,
  },
  facebookLink: {
    type: String,
  },
  twitterLink: {
    type: String,
  },
  linkedInLink: {
    type: String,
  },
  googleLink: {
    type: String,
  },
  youtubeLink: {
    type: String,
  },
  password: {
    type: String,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationCode: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  passwordResetCode: {
    type: String,
  },
  role: {
    type: String,
    default: userRoles.STUDENT,
  },
  category: {
    type: String,
    default: userCategories.OLevel,
  },

  facebookId: {
    type: String,
    index: true,
  },
  facebookAccessToken: {
    type: String,
  },
  googleId: {
    type: String,
    index: true,
  },
  googleAccessToken: {
    type: String,
  },
  createdWith: {
    type: String,
    default: accountCreationType.DEFAULT,
  },
});

userSchema.methods.generateEmailVerificationCode = function () {
  return genereteRandomCode();
};

userSchema.methods.generatePasswordResetCode = function () {
  return genereteRandomCode();
};

const User = mongoose.model("user", userSchema);

function validateSignup(data) {
  const schema = Joi.object({
    firstName: Joi.string().min(1).max(50).required().trim(),
    lastName: Joi.string().min(1).max(50).required().trim(),
    dateOfBirth: Joi.string().min(1).max(50).required().trim(),
    phoneNumber: Joi.string().min(1).max(50).required().trim(),
    school: Joi.string().min(1).required().trim(),
    email: Joi.string().email().min(5).max(50).required().trim().lowercase(),
    password: Joi.string().min(5).max(30).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
  });

  return schema.validate(data);
}

function validateSignin(data) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().trim().lowercase(),
    password: Joi.string().min(5).max(30).required(),
  });

  return schema.validate(data);
}

function validateLoginWithFacebook(data) {
  const schema = Joi.object({
    accessToken: Joi.string().min(50).max(1024).required(),
    userID: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(data);
}

function validateLoginWithGoogle(data) {
  const schema = Joi.object({
    accessToken: Joi.string().min(50).max(1024).required(),
    googleId: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(data);
}

function validateVerificationCode(data) {
  const schema = Joi.object({
    verificationCode: Joi.string().min(6).max(6).required().trim(),
  });
  return schema.validate(data);
}

function validateEmail(data) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().lowercase().trim(),
  });
  return schema.validate(data);
}

function validateEmailAndResetCode(data) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().lowercase().trim(),
    resetCode: Joi.string().min(6).max(6).required().trim(),
  });
  return schema.validate(data);
}

function validatePasswordReset(data) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(50).required().trim().lowercase(),
    verificationCode: Joi.string().min(6).max(6).required().trim(),
    password: Joi.string().min(5).max(30).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
  });
  return schema.validate(data);
}

function validateChangePassword(data) {
  const schema = Joi.object({
    previousPassword: Joi.string().min(5).max(30).required(),
    password: Joi.string().min(5).max(30).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
  });
  return schema.validate(data);
}

function validateCreateUser(data) {
  console.log("validation");
  const schema = Joi.object({
    firstName: Joi.string().min(1).required().lowercase(),
    lastName: Joi.string().min(1).required().lowercase(),
    phoneNumber: Joi.string().min(13).max(13).required().lowercase(),
    email: Joi.string().min(5).required().email().lowercase(),
    dateOfBirth: Joi.string().min(1).required().lowercase(),
    school: Joi.string().min(1).required().lowercase(),
    password: Joi.string().min(5).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref("password")),
    role: Joi.string()
      .valid(
        userRoles.TEACHER,
        userRoles.ADMIN,
        userRoles.STUDENT,
        userRoles.TEACHER_ASSISTANT
      )
      .required(),
    category: Joi.string()
      .valid(
        userCategories.OLevel,
        userCategories.Inter,
        userCategories.ADMIN,
        userCategories.TEACHER_ASSISTANT
      )
      .required(),
  });

  return schema.validate(data);
}

function validateUpdateUser(data) {
  const schema = Joi.object({
    firstName: Joi.string().min(1).required().lowercase(),
    lastName: Joi.string().min(1).required().lowercase(),
    phoneNumber: Joi.string().min(13).max(13).required().lowercase(),
    email: Joi.string().min(5).max(50).allow("", null).lowercase(),
    dateOfBirth: Joi.string().min(1).required().lowercase(),
    school: Joi.string().min(1).required().lowercase(),
    password: Joi.string().min(5).allow("", null),
    confirmPassword: Joi.string().valid(Joi.ref("password")).allow("", null),
    category: Joi.string()
      .valid(
        userCategories.OLevel,
        userCategories.Inter,
        userCategories.ADMIN,
        userCategories.TEACHER_ASSISTANT
      )
      .required(),
    role: Joi.string()
      .valid(
        userRoles.TEACHER,
        userRoles.ADMIN,
        userRoles.STUDENT,
        userRoles.TEACHER_ASSISTANT
      )
      .allow("", null),
  });
  return schema.validate(data);
}

function validateUpdateProfile(data) {
  const schema = Joi.object({
    firstName: Joi.string().min(1).required().lowercase(),
    lastName: Joi.string().min(1).required().lowercase(),
    phoneNumber: Joi.string().min(13).max(13).required().lowercase(),
    email: Joi.string().min(5).max(50).allow("", null).lowercase(),
    dateOfBirth: Joi.string().min(1).required().lowercase(),
    school: Joi.string().min(1).required().lowercase(),
    password: Joi.string().min(5).allow("", null),
    confirmPassword: Joi.string().valid(Joi.ref("password")).allow("", null),
    introduction: Joi.string().min(0).allow("", null),
    facebookLink: Joi.string().min(0).allow("", null),
    twitterLink: Joi.string().min(0).allow("", null),
    linkedInLink: Joi.string().min(0).allow("", null),
    googleLink: Joi.string().min(0).allow("", null),
    youtubeLink: Joi.string().min(0).allow("", null),
  });
  return schema.validate(data);
}

const genereteRandomCode = () => Math.floor(100000 + Math.random() * 900000);

module.exports = {
  User,
  userRoles,
  accountCreationType,
  sanitizeUser,
  validateSignup,
  validateSignin,
  validateLoginWithFacebook,
  validateLoginWithGoogle,
  validateVerificationCode,
  validateEmail,
  validatePasswordReset,
  validateChangePassword,
  validateCreateUser,
  validateUpdateUser,
  validateEmailAndResetCode,
  validateUpdateProfile,
};
