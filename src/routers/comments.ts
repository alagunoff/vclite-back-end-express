import express from "express";

import {
  createComment,
  getComments,
  deleteComments,
} from "controllers/comments";
import { authenticateUser } from "middlewares/auth";

const router = express.Router({ mergeParams: true });

router.post("", authenticateUser(), createComment);
router.get("", getComments);
router.delete("", authenticateUser(true), deleteComments);

export default router;
