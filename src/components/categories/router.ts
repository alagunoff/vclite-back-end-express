import { Router } from "express";

import { authenticateUser } from "middlewares/auth";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "./controllers";

const router = Router();

router.post("", authenticateUser(true), createCategory);
router.get("", getCategories);
router.patch("/:id(\\d+)", authenticateUser(true), updateCategory);
router.delete("/:id(\\d+)", authenticateUser(true), deleteCategory);

export default router;
