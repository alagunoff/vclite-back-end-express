import { Router } from "express";

import { authenticateUser, authenticateAuthor } from "src/middlewares/auth";

import commentsRouter from "./comments/router";
import { createPost, getPosts, updatePost, deletePost } from "./controllers";

const router = Router();

router
  .route("")
  .post(authenticateUser(), authenticateAuthor, createPost())
  .get(getPosts);
router
  .route("/:id(\\d+)")
  .patch(authenticateUser(true), updatePost())
  .delete(authenticateUser(true), deletePost());

router.use("/:postId(\\d+)/comments", commentsRouter);

export default router;
