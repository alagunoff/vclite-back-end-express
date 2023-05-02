import express from "express";

import { authenticateUser } from "middlewares/auth";

import { createComment, getComments, deleteComments } from "./controllers";

const router = express.Router({ mergeParams: true });

router.post("", authenticateUser(), createComment);
router.get("", getComments);
router.delete("", authenticateUser(true), deleteComments);

export default router;
