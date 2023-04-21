import express from "express";

import {
  createComment,
  getComments,
  deleteComments,
} from "controllers/comments";
import { authenticateUser } from "middlewares/auth";
import { isAdmin } from "middlewares/roles";

const router = express.Router({ mergeParams: true });

router.post("", authenticateUser(), createComment);
router.get("", getComments);
router.delete("", [authenticateUser(404), isAdmin], deleteComments);

export default router;
