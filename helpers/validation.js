const mongoose = require("mongoose");

function validateObjectId(objectId) {
  if (objectId.length !== 24) return false;

  return mongoose.Types.ObjectId.isValid(objectId);
}

module.exports = {
  validateObjectId,
};
