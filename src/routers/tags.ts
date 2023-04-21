import express from "express";

import { createTag, getTags, updateTag, deleteTag } from "controllers/tags";
import { authenticateUser } from "middlewares/auth";
import { isAdmin } from "middlewares/roles";

const router = express.Router();

router.post("", [authenticateUser(404), isAdmin], createTag);
router.get("", getTags);
router.patch("/:id", [authenticateUser(404), isAdmin], updateTag);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteTag);

export default router;
