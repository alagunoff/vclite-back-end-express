import { Router } from "express";

import { authenticateUser } from "shared/authentication/middlewares";

import * as commentsRouter from "./comments/router";
import { createPost, getPosts, updatePost, deletePost } from "./controllers";

const router = Router();

router.route("").post(authenticateUser("author"), createPost).get(getPosts);
router
  .route("/:id(\\d+)")
  .patch(authenticateUser("admin"), updatePost)
  .delete(authenticateUser("admin"), deletePost);

router.use("/:postId(\\d+)/comments", commentsRouter.router);

export { router };
