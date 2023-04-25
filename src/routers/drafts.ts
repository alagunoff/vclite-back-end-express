import express from "express";

import {
  createDraft,
  getDrafts,
  updateDraft,
  publishDraft,
  deleteDraft,
} from "controllers/drafts";
import { authenticateUser, authenticateAuthor } from "middlewares/auth";

const router = express.Router();

router.post("", [authenticateUser(), authenticateAuthor], createDraft);
router.get("", [authenticateUser(), authenticateAuthor], getDrafts);
router.patch(
  "/:id(\\d+)",
  [authenticateUser(), authenticateAuthor],
  updateDraft
);
router.post(
  "/:id(\\d+)",
  [authenticateUser(), authenticateAuthor],
  publishDraft
);
router.delete(
  "/:id(\\d+)",
  [authenticateUser(), authenticateAuthor],
  deleteDraft
);

export default router;
