import express from "express";

import {
  createDraft,
  getDrafts,
  updateDraft,
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
router.delete(
  "/:id(\\d+)",
  [authenticateUser(), authenticateAuthor],
  deleteDraft
);

export default router;
