import { Router } from "express";

import { authenticateUser } from "shared/authentication/middlewares";

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
  .route("/:id([1-9][0-9]{0,})")
  .patch(authenticateUser("admin"), updateCategory)
  .delete(authenticateUser("admin"), deleteCategory);

export { router };
