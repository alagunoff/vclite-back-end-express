import express from "express";

import { createUser, getUser, deleteUser } from "controllers/users";
import { authenticateUser, isAdmin } from "middlewares/auth";

const router = express.Router();
router.post("", createUser);
router.get("", authenticateUser(), getUser);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteUser);

export default router;
