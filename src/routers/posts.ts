import express from "express";

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "controllers/posts";
import { authenticateUser, isAdmin } from "middlewares/auth";
import commentsRouter from "./comments";

const router = express.Router();

router.post("", authenticateUser(), createPost);
router.get("", getPosts);
router.patch("/:id", [authenticateUser(404), isAdmin], updatePost);
router.delete("/:id", [authenticateUser(404), isAdmin], deletePost);

router.use("/:postId/comments", commentsRouter);

export default router;
