import express from "express";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "controllers/categories";
import { authenticateUser } from "middlewares/auth";
import { isAdmin } from "middlewares/roles";

const router = express.Router();

router.post("", [authenticateUser(404), isAdmin], createCategory);
router.get("", getCategories);
router.patch("/:id", [authenticateUser(404), isAdmin], updateCategory);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteCategory);

export default router;
