const AWS = require("aws-sdk");

module.exports = function () {
  AWS.config.update({
    accessKeyId: "AKIAJ3ATYIZJJA55OTJA",
    secretAccessKey: "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",
  });
  console.log("S3 configured");
};
