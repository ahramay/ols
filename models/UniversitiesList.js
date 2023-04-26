const mongoose = require("mongoose");

const universitiesListSchema = mongoose.Schema({
  image: {
    type: String,
    default: "",
  },
  sortOrder: {
    type: Number,
    default: 0,
  },
});

const UniversitiesList = mongoose.model(
  "UniversitiesList",
  universitiesListSchema
);

exports.UniversitiesList = UniversitiesList;
