import { Router } from "express";

import { authenticateUser } from "src/shared/middlewares/auth";

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
  .route("/:id(\\d+)")
  .patch(authenticateUser("admin"), updateAuthor)
  .delete(authenticateUser("admin"), deleteAuthor);

export default router;
