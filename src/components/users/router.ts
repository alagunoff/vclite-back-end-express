import { Router } from "express";

import { authenticateUser } from "src/middlewares/auth";

import { createUser, getUser, deleteUser } from "./controllers";

const router = Router();

router.post("", createUser);
router.get("", authenticateUser(), getUser);
router.delete("/:id(\\d+)", authenticateUser(true), deleteUser);

export default router;
