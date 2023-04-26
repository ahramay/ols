const express = require("express");
const router = express.Router();
const { authorize } = require("../../middlewares/authorization");

const { User, userRoles } = require("../../models/User");
const { ADMIN } = userRoles;
const {
  Comment,
  validateComment,
  validateReply,
} = require("../../models/Comment");
const { validateObjectId } = require("../../helpers/validation");

//comments
router.post("/comment", authorize(), async (req, res) => {
  const { error } = validateComment(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { user } = req.authSession;
  const { comment, content } = req.body;

  const result = await new Comment({
    comment,
    content,
    createdBy: user._id,
    createdAt: Date.now(),
  }).save();

  const data = await Comment.findById(result._id)
    .populate("createdBy", "_id firstName lastName image")
    .populate("replies.createdBy", "_id firstName lastName image");

  res.sendApiResponse({ data });
});

router.post("/reply_comment", authorize(), async (req, res) => {
  const { error } = validateReply(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { user } = req.authSession;
  const { comment, commentId, replyingTo } = req.body;

  const reply = await Comment.findOneAndUpdate(
    { _id: commentId },
    {
      $push: {
        replies: {
          comment,
          createdBy: user._id,
        },
      },
    },
    { new: true }
  );

  const data = await Comment.findById(reply._id)
    .populate("createdBy", "_id firstName lastName image")
    .populate("replies.createdBy", "_id firstName lastName image");

  res.sendApiResponse({ data });
});

router.get(
  "/comments/:content",
  /*authorize(),*/ async (req, res) => {
    const { content } = req.params;

    const isValidID = validateObjectId(content);
    if (!isValidID) return res.status(400).send("Invalid content ID");

    let { pageSize = 20, pageNum = 1 } = req.query;
    pageSize = parseInt(pageSize);
    pageNum = parseInt(pageNum);
    const offset = pageSize * (pageNum - 1);

    const commentsQuery = { content, isDeleted: false };
    const comments = await Comment.find(commentsQuery)
      .populate("createdBy", "_id firstName lastName image")
      .populate("replies.createdBy", "_id firstName lastName image")
      .sort("-_id");
    // .skip(offset)
    // .limit(pageSize);

    const totalCount = await Comment.find(commentsQuery).count();
    const hasMore = offset + pageSize < totalCount;
    const data = {
      pageSize,
      pageNum,
      totalCount,
      hasMore,
      list: comments,
    };

    res.sendApiResponse({ data });
  }
);

router.delete("/delete_comment/:id", authorize(ADMIN), async (req, res) => {
  const { id } = req.params;
  if (!validateObjectId(id))
    return res.sendApiResponse({ status: 400, message: "Invalid Comment Id" });

  const comment = await Comment.findByIdAndDelete(id);
  res.sendApiResponse({ message: "Comment Deleted" });
});
module.exports = router;
