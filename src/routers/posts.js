const express = require("express");
const router = express.Router();

const { createPost, getPosts, deletePost } = require("../controllers/posts");
const { authenticateUser, isAdmin } = require("../middlewares/auth");
const commentsRouter = require("./comments");

router.post("", [authenticateUser(404), isAdmin], createPost);
router.get("", getPosts);
router.delete("/:id", [authenticateUser(404), isAdmin], deletePost);

router.use("/:postId/comments", commentsRouter);

module.exports = router;
