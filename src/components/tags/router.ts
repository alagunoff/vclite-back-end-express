import { Router } from "express";

import { authenticateUser } from "src/middlewares/auth";

import { createTag, getTags, updateTag, deleteTag } from "./controllers";

const router = Router();

router.route("").post(authenticateUser(true), createTag).get(getTags);
router
  .route("/:id(\\d+)")
  .patch(authenticateUser(true), updateTag)
  .delete(authenticateUser(true), deleteTag);

export default router;
