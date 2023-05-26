import { Router } from "express";

import { authenticateUser } from "src/shared/middlewares/auth";

import { createComment, getComments, deleteComments } from "./controllers";

const router = Router({ mergeParams: true });

router
  .route("")
  .post(authenticateUser(), createComment)
  .get(getComments)
  .delete(authenticateUser("admin"), deleteComments);

export default router;
