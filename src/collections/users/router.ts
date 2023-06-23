import { Router } from "express";

import { authenticateUser } from "shared/authentication/middlewares";

import { createUser, getUser, deleteUser } from "./controllers";

const router = Router();

router.route("").post(createUser).get(authenticateUser(), getUser);
router
  .route("/:id([1-9][0-9]{0,})")
  .delete(authenticateUser("admin"), deleteUser);

export { router };
