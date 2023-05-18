import { Router } from "express";

import { authenticateUser } from "src/middlewares/auth";

import {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} from "./controllers";

const router = Router();

router
  .route("")
  .post(authenticateUser(true), createAuthor)
  .get(authenticateUser(true), getAuthors);
router
  .route("/:id(\\d+)")
  .patch(authenticateUser(true), updateAuthor)
  .delete(authenticateUser(true), deleteAuthor);

export default router;
