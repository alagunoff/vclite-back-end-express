import { Router } from "express";

import { authenticateUser, authenticateAuthor } from "src/middlewares/auth";
import { createPost } from "src/components/posts/controllers";

import {
  getDrafts,
  updateDraft,
  publishDraft,
  deleteDraft,
} from "./controllers";

const router = Router();

router.post("", authenticateUser(), authenticateAuthor, createPost(true));
router.get("", authenticateUser(), authenticateAuthor, getDrafts);
router.patch("/:id(\\d+)", authenticateUser(), authenticateAuthor, updateDraft);
router.post(
  "/:id(\\d+)/publish",
  authenticateUser(),
  authenticateAuthor,
  publishDraft
);
router.delete(
  "/:id(\\d+)",
  authenticateUser(),
  authenticateAuthor,
  deleteDraft
);

export default router;
