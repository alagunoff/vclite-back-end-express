import { Router } from "express";

import { authenticateUser } from "auth/middlewares";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "./controllers";

const router = Router();

router
  .route("")
  .post(authenticateUser("admin"), createCategory)
  .get(getCategories);
router
  .route("/:id(\\d+)")
  .patch(authenticateUser("admin"), updateCategory)
  .delete(authenticateUser("admin"), deleteCategory);

export { router };
