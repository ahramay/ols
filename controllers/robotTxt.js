const express = require("express");
const AWS = require("aws-sdk");

const router = express.Router();

router.get("/robot.txt", async (req, res) => {
  const s3 = new AWS.S3();
  s3.getObject({ Bucket: "outclasslms", Key: "uploads/documents/robot.txt" })
    .createReadStream()
    .pipe(res);
});
module.exports = router;
