import { Router } from "express";

import { authenticateUser, authenticateAuthor } from "src/middlewares/auth";
import {
  createPost,
  updatePost,
  deletePost,
} from "src/components/posts/controllers";

import { getDrafts, publishDraft } from "./controllers";

const router = Router();

router.post("", authenticateUser(), authenticateAuthor, createPost(true));
router.get("", authenticateUser(), authenticateAuthor, getDrafts);
router.patch(
  "/:id(\\d+)",
  authenticateUser(),
  authenticateAuthor,
  updatePost(true)
);
router.delete(
  "/:id(\\d+)",
  authenticateUser(),
  authenticateAuthor,
  deletePost(true)
);

router.post(
  "/:id(\\d+)/publish",
  authenticateUser(),
  authenticateAuthor,
  publishDraft
);

export default router;
