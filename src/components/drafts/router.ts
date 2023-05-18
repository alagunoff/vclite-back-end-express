import { Router } from "express";

import { authenticateUser, authenticateAuthor } from "src/middlewares/auth";
import {
  createPost,
  updatePost,
  deletePost,
} from "src/components/posts/controllers";

import { getDrafts, publishDraft } from "./controllers";

const router = Router();

router
  .route("")
  .post(authenticateUser(), authenticateAuthor, createPost(true))
  .get(authenticateUser(), authenticateAuthor, getDrafts);
router
  .route("/:id(\\d+)")
  .patch(authenticateUser(), authenticateAuthor, updatePost(true))
  .delete(authenticateUser(), authenticateAuthor, deletePost(true));

router.post(
  "/:id(\\d+)/publish",
  authenticateUser(),
  authenticateAuthor,
  publishDraft
);

export default router;
