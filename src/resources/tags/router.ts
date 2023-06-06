import { Router } from "express";

import { authenticateUser } from "auth/middlewares";

import { createTag, getTags, updateTag, deleteTag } from "./controllers";

const router = Router();

router.route("").post(authenticateUser("admin"), createTag).get(getTags);
router
  .route("/:id(\\d+)")
  .patch(authenticateUser("admin"), updateTag)
  .delete(authenticateUser("admin"), deleteTag);

export default router;
