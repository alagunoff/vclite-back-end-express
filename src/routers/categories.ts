import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "controllers/categories";
import { authenticateUser } from "middlewares/auth";

const router = express.Router();

router.post("", authenticateUser(true), createCategory);
router.get("", getCategories);
router.patch("/:id(\\d+)", authenticateUser(true), updateCategory);
router.delete("/:id(\\d+)", authenticateUser(true), deleteCategory);

export default router;
