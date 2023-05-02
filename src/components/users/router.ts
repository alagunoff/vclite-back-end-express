import express from "express";

import { authenticateUser } from "middlewares/auth";

import { createUser, getUser, deleteUser } from "./controllers";

const router = express.Router();

router.post("", createUser);
router.get("", authenticateUser(), getUser);
router.delete("/:id(\\d+)", authenticateUser(true), deleteUser);

export default router;
