import { Router } from "express";

import { authenticateUser } from "shared/authentication/middlewares";

import { createTag, getTags, updateTag, deleteTag } from "./controllers";

const router = Router();

router.route("").post(authenticateUser("admin"), createTag).get(getTags);
router
  .route("/:id([1-9][0-9]{0,})")
  .patch(authenticateUser("admin"), updateTag)
  .delete(authenticateUser("admin"), deleteTag);

export { router };
