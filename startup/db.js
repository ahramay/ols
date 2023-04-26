const mongoose = require("mongoose");
const config = require("config");

//free tier
//mongodb+srv://TreeApp:treeapp@cluster0-2z7jj.mongodb.net/TreeDB?retryWrites=true&w=majority

const dbConnection = config.get("db");
module.exports = async function () {
  console.log("Connecting to database...");
  mongoose
    .connect(dbConnection, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected to database...");
    })
    .catch((err) => {
      console.log("DB connection failed...");
      throw err;
    });
};

// const mongoose = require("mongoose");
// const config = require("config");
// const fs = require("fs");
// const path = require("path");

// const env = process.env.NODE_ENV;
// const dbConnection = config.get("db");

// const options = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// };

// if (env === "production") {
//   var ca = [
//     fs.readFileSync(path.join(__dirname, "rds-combined-ca-bundle.pem")),
//   ];
//   options.sslValidate = true;
//   options.sslCA = ca;
//   options.useNewUrlParser = true;
// }
// module.exports = function () {
//   mongoose
//     .connect(dbConnection, options)
//     .then(() => console.log("Conncted to mongodb"));
// };
