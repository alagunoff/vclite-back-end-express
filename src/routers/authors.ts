import express from "express";

import {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} from "controllers/authors";
import { authenticateUser } from "middlewares/auth";

const router = express.Router();

router.post("", authenticateUser(true), createAuthor);
router.get("", authenticateUser(true), getAuthors);
router.patch("/:id", authenticateUser(true), updateAuthor);
router.delete("/:id", authenticateUser(true), deleteAuthor);

export default router;
