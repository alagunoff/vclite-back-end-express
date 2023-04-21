import express from "express";

import {
  createDraft,
  getDrafts,
  updateDraft,
  deleteDraft,
} from "controllers/drafts";
import { authenticateUser, isAdmin } from "middlewares/auth";

const router = express.Router();

router.post("", authenticateUser(), createDraft);
router.get("", [authenticateUser()], getDrafts);
router.patch("/:id", [authenticateUser(404), isAdmin], updateDraft);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteDraft);

export default router;
