const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

const VALID_VIDEO_EXTENSIONS = [
  // MP4
  "mp4",
  "m4a",
  "m4v",
  "f4v",
  "f4a",
  "m4b",
  "m4r",
  "f4b",
  "mov",
  // 3GP
  "3gp",
  "3gp2",
  "3g2",
  "3gpp",
  "3gpp2",
  // OGG
  "ogg",
  "oga",
  "ogv",
  "ogx",
  // WMV
  "wmv",
  "wma",
  "asf",
  // WEBM
  "webm",
  // FLV
  "flv",
  // AVI
  "avi",
  // Quicktime
  "qt",
  // HDV
  "hdv",
  // MXF
  "OP1a",
  "OP-Atom",
  // MPEG-TS
  "ts",
  "mts",
  "m2ts",
  // WAV
  "wav",
  // Misc
  "lxf",
  "gxf",
  "vob",
];

async function readFileAsync(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, "utf8", function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

exports.write = (path, fileData) => {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, fileData, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

exports.validateVideo = function (name) {
  const ext = name.split(".").pop();
  return VALID_VIDEO_EXTENSIONS.includes(ext);
};

exports.getFileName = (name) => {
  const unique = uuid.v4();
  const ext = path.extname(name);
  return unique + ext.toLocaleLowerCase();
};

exports.deleteFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.unlink(path, (err) => {
      return err ? reject(err) : resolve();
    });
  });
};
exports.readFileAsync = readFileAsync;
