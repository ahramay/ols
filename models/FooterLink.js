const mongoose = require("mongoose");

const footerLinksSchema = new mongoose.Schema({
  foot1: [
    {
      name: {
        type: String,
      },
      link: {
        type: String,
      },
      sortOrder: {
        type: Number,
        default: 0,
      },
    },
  ],
  foot2: [
    {
      name: {
        type: String,
      },
      link: {
        type: String,
      },
      sortOrder: {
        type: Number,
        default: 0,
      },
    },
  ],
  foot3: [
    {
      name: {
        type: String,
      },
      link: {
        type: String,
      },
      sortOrder: {
        type: Number,
        default: 0,
      },
    },
  ],
  foot4: [
    {
      name: {
        type: String,
      },
      link: {
        type: String,
      },
      sortOrder: {
        type: Number,
        default: 0,
      },
    },
  ],
});

module.exports.FooterLinks = mongoose.model("FooterLinks", footerLinksSchema);
