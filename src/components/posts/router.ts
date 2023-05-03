import { Router } from "express";

import { authenticateUser, authenticateAuthor } from "middlewares/auth";

import commentsRouter from "./comments/router";
import { createPost, getPosts, updatePost, deletePost } from "./controllers";

const router = Router();

router.post("", authenticateUser(), authenticateAuthor, createPost);
router.get("", getPosts);
router.patch("/:id(\\d+)", authenticateUser(true), updatePost);
router.delete("/:id(\\d+)", authenticateUser(true), deletePost);

router.use("/:postId(\\d+)/comments", commentsRouter);

export default router;
