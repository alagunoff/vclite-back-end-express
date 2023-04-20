import express from "express";

import {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} from "controllers/authors";
import { authenticateUser, isAdmin } from "middlewares/auth";

const router = express.Router();
router.post("", [authenticateUser(404), isAdmin], createAuthor);
router.get("", [authenticateUser(404), isAdmin], getAuthors);
router.patch("/:id", [authenticateUser(404), isAdmin], updateAuthor);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteAuthor);

export default router;
