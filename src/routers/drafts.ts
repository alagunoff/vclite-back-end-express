import express from "express";

import {
  createDraft,
  getDrafts,
  updateDraft,
  deleteDraft,
} from "controllers/drafts";
import { authenticateUser } from "middlewares/auth";
import { isAdmin, isAuthor } from "middlewares/roles";

const router = express.Router();

router.post("", [authenticateUser(), isAuthor], createDraft);
router.get("", [authenticateUser(), isAuthor], getDrafts);
router.patch("/:id", [authenticateUser(404), isAdmin], updateDraft);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteDraft);

export default router;
