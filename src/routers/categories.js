const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const { authenticateUser, isAdmin } = require("../middlewares/auth");

router.post("", [authenticateUser(404), isAdmin], createCategory);
router.get("", getCategories);
router.patch("/:id", [authenticateUser(404), isAdmin], updateCategory);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteCategory);

module.exports = router;
