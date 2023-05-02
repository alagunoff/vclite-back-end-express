import express from "express";

import { authenticateUser } from "middlewares/auth";

import {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} from "./controllers";

const router = express.Router();

router.post("", authenticateUser(true), createAuthor);
router.get("", authenticateUser(true), getAuthors);
router.patch("/:id(\\d+)", authenticateUser(true), updateAuthor);
router.delete("/:id(\\d+)", authenticateUser(true), deleteAuthor);

export default router;
