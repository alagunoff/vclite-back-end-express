import { Router } from "express";

import { authenticateUser } from "src/auth/middlewares";

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
  .route("/:id(\\d+)")
  .patch(authenticateUser("author"), updateDraft)
  .delete(authenticateUser("author"), deleteDraft);

router.post("/:id(\\d+)/publish", authenticateUser("author"), publishDraft);

export default router;
