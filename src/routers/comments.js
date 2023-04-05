const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  createComment,
  getComments,
  deleteComments,
} = require("../controllers/comments");
const authenticateUser = require("../middlewares/authenticateUser");
const isAdmin = require("../middlewares/isAdmin");

router.post("", createComment);
router.get("", getComments);
router.delete("", [authenticateUser(404), isAdmin], deleteComments);

module.exports = router;
