import { Router } from "express";

import { authenticateUser } from "shared/authentication/middlewares";

import {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} from "./controllers";

const router = Router();

router
  .route("")
  .post(authenticateUser("admin"), createAuthor)
  .get(authenticateUser("admin"), getAuthors);
router
  .route("/:id([1-9][0-9]{0,})")
  .patch(authenticateUser("admin"), updateAuthor)
  .delete(authenticateUser("admin"), deleteAuthor);

export { router };
