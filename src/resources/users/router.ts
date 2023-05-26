import { Router } from "express";

import { authenticateUser } from "src/shared/middlewares/auth";

import { createUser, getUser, deleteUser } from "./controllers";

const router = Router();

router.route("").post(createUser).get(authenticateUser(), getUser);
router.route("/:id(\\d+)").delete(authenticateUser("admin"), deleteUser);

export default router;
