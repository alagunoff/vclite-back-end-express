import express from "express";

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "controllers/posts";
import { authenticateUser, authenticateAuthor } from "middlewares/auth";

import commentsRouter from "./comments";

const router = express.Router();

router.post("", [authenticateUser(), authenticateAuthor], createPost);
router.get("", getPosts);
router.patch("/:id", authenticateUser(true), updatePost);
router.delete("/:id", authenticateUser(true), deletePost);

router.use("/:postId/comments", commentsRouter);

export default router;
