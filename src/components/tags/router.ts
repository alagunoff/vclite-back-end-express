import express from "express";

import { authenticateUser } from "middlewares/auth";

import { createTag, getTags, updateTag, deleteTag } from "./controllers";

const router = express.Router();

router.post("", authenticateUser(true), createTag);
router.get("", getTags);
router.patch("/:id(\\d+)", authenticateUser(true), updateTag);
router.delete("/:id(\\d+)", authenticateUser(true), deleteTag);

export default router;
