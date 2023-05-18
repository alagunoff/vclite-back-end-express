import { Router } from "express";

import { authenticateUser } from "src/middlewares/auth";

import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "./controllers";

const router = Router();

router
  .route("")
  .post(authenticateUser(true), createCategory)
  .get(getCategories);
router
  .route("/:id(\\d+)")
  .patch(authenticateUser(true), updateCategory)
  .delete(authenticateUser(true), deleteCategory);

export default router;
