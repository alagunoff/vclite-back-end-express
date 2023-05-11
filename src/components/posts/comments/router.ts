import { Router } from "express";

import { authenticateUser } from "src/middlewares/auth";

import { createComment, getComments, deleteComments } from "./controllers";

const router = Router({ mergeParams: true });

router.post("", authenticateUser(), createComment);
router.get("", getComments);
router.delete("", authenticateUser(true), deleteComments);

export default router;
