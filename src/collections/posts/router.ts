import { Router } from "express";

import { authenticateUser } from "shared/authentication/middlewares";

import * as commentsRouter from "./comments/router";
import { createPost, getPosts, updatePost, deletePost } from "./controllers";

const router = Router();

router.route("").post(authenticateUser("author"), createPost).get(getPosts);
router
  .route("/:id([1-9][0-9]{0,})")
  .patch(authenticateUser("admin"), updatePost)
  .delete(authenticateUser("admin"), deletePost);

router.use("/:postId([1-9][0-9]{0,})/comments", commentsRouter.router);

export { router };
