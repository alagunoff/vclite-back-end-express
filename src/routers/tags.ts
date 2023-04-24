import express from "express";

import { createTag, getTags, updateTag, deleteTag } from "controllers/tags";
import { authenticateUser } from "middlewares/auth";

const router = express.Router();

router.post("", authenticateUser(true), createTag);
router.get("", getTags);
router.patch("/:id(\\d+)", authenticateUser(true), updateTag);
router.delete("/:id(\\d+)", authenticateUser(true), deleteTag);

export default router;
