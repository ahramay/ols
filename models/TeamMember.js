const mongoose = require("mongoose");
const Joi = require("joi");

const teamMemberSchema = new mongoose.Schema({
  name: { type: String },
  image: {
    type: String,
  },
  designation: {
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
  instagramLink: {
    type: String,
  },
  showOnHome: {
    type: Boolean,
    default: true,
  },
  showOnAbout: {
    type: Boolean,
    default: true,
  },
  showOnTeacher: {
    type: Boolean,
    default: true,
  },
  coreTeam: {
    type: Boolean,
    default: true,
  },
  leadership: {
    type: Boolean,
    default: true,
  },
  managementBoard: {
    type: Boolean,
    default: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "category",
  },

  isDeleted: { type: Boolean, default: false },
});

const TeamMember = mongoose.model("teammember", teamMemberSchema);

function validateTeamMember(data) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required().trim(),
    designation: Joi.string().min(1).max(50).required().trim(),
    introduction: Joi.string().min(1).required().trim(),
    facebookLink: Joi.string().min(1).required().trim(),
    twitterLink: Joi.string().min(1).required().trim(),
    linkedInLink: Joi.string().min(1).required().trim(),
    instagramLink: Joi.string().min(1).required().trim(),
    showOnHome: Joi.boolean().required(),
    showOnAbout: Joi.boolean().required(),
    showOnTeacher: Joi.boolean().required(),
    managementBoard: Joi.boolean().required(),
    coreTeam: Joi.boolean().required(),
    leadership: Joi.boolean().required(),
    category: Joi.string().min(1).max(50).required().trim(),
  });

  return schema.validate(data);
}

module.exports = {
  TeamMember,
  validateTeamMember,
};
