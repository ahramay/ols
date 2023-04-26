const path = require("path");
const AWS = require("aws-sdk");
const fileHelper = require("../helpers/file");
const config = require("config");
const baseUploadPath = path.join("./public/uploads/");
const mode = config.get("fileSystem"); //fs to save locally and s3 to upload in s3 bucket
const mediaPath = config.get("mediaPath");
const fs = require("fs");

exports.uploadFile = async (filePath, fileData) => {
  try {
    if (mode === "s3") {
      var params = {
        Bucket: "outclasslms",
        Body: fileData,
        Key: "uploads/" + filePath,
      };
      const s3 = new AWS.S3();
      upload = await s3.upload(params).promise();
      return upload;
    } else {
      const upPath = path.join(baseUploadPath, filePath);

      let data = await fileHelper.write(upPath, fileData);
      data = {
        Location: mediaPath + "uploads/" + filePath,
      };
      return data;
    }
  } catch (err) {
    throw err;
  }
};

exports.streamUpload = ({ filePath, fileData, onComplete, onError }) => {
  if (mode === "s3") {
    var params = {
      Bucket: "treemedia",
      Body: fileData,
      Key: "uploads/" + filePath,
    };

    const options = { partSize: 5 * 1024 * 1024, queueSize: 10 };
    var s3 = new AWS.S3();
    s3.upload(params, options, function (err, data) {
      if (err) {
        if (onError) {
          onError(err);
        } else {
          throw err;
        }
      }
      if (onComplete) onComplete(data);
    })
      .on("httpUploadProgress", function (evt) {})
      .on("end", function () {});
  } else {
    const saveTo = path.join(baseUploadPath + filePath);
    const outStream = fs.createWriteStream(saveTo);

    outStream.on("finish", () => {
      data = {
        Location: mediaPath + "uploads/" + filePath,
      };
      if (onComplete) onComplete(data);
    });
    outStream.on("error", (err) => {
      throw err;
    });
    fileData.pipe(outStream);
  }
};
