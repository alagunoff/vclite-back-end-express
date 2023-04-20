const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createComment,
  getComments,
  deleteComments,
} = require("../controllers/comments");
const { authenticateUser, isAdmin } = require("../middlewares/auth");

router.post("", createComment);
router.get("", getComments);
router.delete("", [authenticateUser(404), isAdmin], deleteComments);

module.exports = router;
