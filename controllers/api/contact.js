const express = require("express");
const router = express.Router();
const Joi = require("joi");

const { sendContactEmail } = require("../../services/mailer");

router.post("/", async (req, res) => {
  const { value, error } = validateContact(req.body);
  if (error)
    return res.sendApiResponse({
      status: 400,
      message: error.details[0].message,
    });

  value.logoImage = req.base_url + "/images/logo.png";
  await sendContactEmail(value);
  res.send(value);
});

module.exports = router;

function validateContact(data) {
  const schema = Joi.object({
    name: Joi.string().required().trim(),
    profession: Joi.string().min(1).required().trim(),
    phoneNumber: Joi.string().min(1).required().trim(),
    email: Joi.string().email().min(5).max(50).required().trim().lowercase(),
    message: Joi.string().required().trim(),
  });

  return schema.validate(data);
}
