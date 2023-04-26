const path = require("path");
const nodemailer = require("nodemailer");
const mailerHbs = require("nodemailer-express-handlebars");
const { hbs } = require("../engines/handlebars");

const hbsOptions = {
  viewEngine: hbs,

  defaultLayout: "main",
  layoutsDir: "views/layouts",
  viewPath: "views",
};

const makeTransporter = ({
  user = "admin@out-class.org",
  pass = "synigbxlippylbxk",
} = {}) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user, // generated ethereal user
      pass, // generated ethereal password
    },
  });

  transporter.use("compile", mailerHbs(hbsOptions));
  return transporter;
};

const sendVerificationEmail = async ({
  to,

  verificationCode,
  logoImage,
}) => {
  let transporter = makeTransporter();

  const mailOptions = {
    // from: "family@tree.art", // sender address
    to,
    subject: "Account Verification Email", // Subject line
    text: "Welcome to Outclass", // plain text body
    template: "email/verify_account",
    context: {
      layout: "email",
      verificationCode,
      heading: "Welcome to Outclass",
      logoImage,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("MAIL SENT");
  } catch (e) {
    console.log("EMAIL FAILED", e);
  }
};

const sendPasswordResetEmail = async ({ to, resetCode, logoImage }) => {
  let transporter = makeTransporter();

  const mailOptions = {
    to,
    subject: "Reset your account's password", // Subject line
    text: "Reset Password", // plain text body
    template: "email/reset_password",
    context: {
      logoImage,
      layout: "email",
      resetCode,
      heading: "Reset Password",
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("MAIL SENT");
  } catch (e) {
    console.log("EMAIL FAILED", e);
  }
};

const sendContactEmail = async (payload) => {
  let transporter = makeTransporter();

  const mailOptions = {
    to: "support@out-class.org",
    subject: "Contact Email", // Subject line
    text: "Contact Email", // plain text body
    template: "email/contact_email",
    context: {
      layout: "email",
      heading: "Contact Email",
      ...payload,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("MAIL SENT");
  } catch (e) {
    console.log("EMAIL FAILED", e);
  }
};

const sendOrderPlacingEmail = async ({ to, orderId, logoImage }) => {
  let transporter = makeTransporter();

  const mailOptions = {
    // from: "family@tree.art", // sender address
    to,
    subject: "Order Placing Email", // Subject line
    text: "Thank you for placing order at Outclass", // plain text body
    template: "email/order_confirmation",
    context: {
      layout: "email",
      orderId,
      heading: "Thank You!",
      logoImage,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("MAIL SENT");
  } catch (e) {
    console.log("EMAIL FAILED", e);
  }
};

const sendOrderAdminNotificationEmail = async ({
  orderId,
  logoImage,
  userName,
}) => {
  let transporter = makeTransporter();

  const mailOptions = {
    // from: "family@tree.art", // sender address
    to: "admin@out-class.org",
    subject: "Order Placing Email", // Subject line
    text: "Thank you for placing order at Outclass", // plain text body
    template: "email/order_admin_notification",
    context: {
      layout: "email",
      orderId,
      heading: "Thank You!",
      logoImage,
      userName,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("MAIL SENT");
  } catch (e) {
    console.log("EMAIL FAILED", e);
  }
};

const sendOrderCompletionEmail = async ({ to, orderId, logoImage }) => {
  let transporter = makeTransporter();

  const mailOptions = {
    // from: "family@tree.art", // sender address
    to,
    subject: "Order Completed", // Subject line
    text: "You are now enrolled into courses", // plain text body
    template: "email/order_completed",
    context: {
      layout: "email",
      orderId,
      heading: "Enrollment Successfull",
      logoImage,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("MAIL SENT");
  } catch (e) {
    console.log("EMAIL FAILED", e);
  }
};

const sendOSubscriptionExpiryEmail = async ({
  to,
  logoImage,
  user_name,
  courses,
  category_name,
}) => {
  let transporter = makeTransporter();

  const mailOptions = {
    logoImage: "https://www.out-class.org/images/logo.png",
    to,
    subject: "Subscription Ending Reminder", // Subject line
    text: "Your subscription is about to end. re-subscribe to maintain you access to the courses.", // plain text body
    template: "email/subscription_end_email",
    context: {
      layout: "email",
      heading: "Rr-Subscribe",
      user_name,
      category_name,
      courses,
    },
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("MAIL SENT");
  } catch (e) {
    console.log("EMAIL FAILED", e);
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendContactEmail,
  sendOrderPlacingEmail,
  sendOrderCompletionEmail,
  sendOrderAdminNotificationEmail,
  sendOSubscriptionExpiryEmail,
};
