import express from "express";

import {
  createPost,
  getPosts,
  updatePost,
  deletePost,
} from "controllers/posts";
import { authenticateUser } from "middlewares/auth";
import { isAdmin, isAuthor } from "middlewares/roles";

import commentsRouter from "./comments";

const router = express.Router();

router.post("", [authenticateUser(), isAuthor], createPost);
router.get("", getPosts);
router.patch("/:id", [authenticateUser(404), isAdmin], updatePost);
router.delete("/:id", [authenticateUser(404), isAdmin], deletePost);

router.use("/:postId/comments", commentsRouter);

export default router;
