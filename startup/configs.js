const config = require("config");

module.exports = function () {
  //database connection
  const dbConnection = config.get("db");
  if (!dbConnection) {
    throw new Error("FATAL ERROR: database connection is not configured.");
  }
};
