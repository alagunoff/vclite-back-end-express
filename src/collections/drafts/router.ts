import { Router } from "express";

import { authenticateUser } from "shared/authentication/middlewares";

import {
  createDraft,
  getDrafts,
  updateDraft,
  publishDraft,
  deleteDraft,
} from "./controllers";

const router = Router();

router
  .route("")
  .post(authenticateUser("author"), createDraft)
  .get(authenticateUser("author"), getDrafts);
router
  .route("/:id([1-9][0-9]{0,})")
  .patch(authenticateUser("author"), updateDraft)
  .delete(authenticateUser("author"), deleteDraft);

router.post(
  "/:id([1-9][0-9]{0,})/publish",
  authenticateUser("author"),
  publishDraft
);

export { router };
