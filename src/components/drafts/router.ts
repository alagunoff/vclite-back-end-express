import { Router } from "express";

import { authenticateUser } from "src/middlewares/auth";
import {
  createPost,
  updatePost,
  deletePost,
} from "src/components/posts/controllers";

import { getDrafts, publishDraft } from "./controllers";

const router = Router();

router
  .route("")
  .post(authenticateUser("author"), createPost(true))
  .get(authenticateUser("author"), getDrafts);
router
  .route("/:id(\\d+)")
  .patch(authenticateUser("author"), updatePost(true))
  .delete(authenticateUser("author"), deletePost(true));

router.post("/:id(\\d+)/publish", authenticateUser("author"), publishDraft);

export default router;
