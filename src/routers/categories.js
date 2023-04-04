const express = require("express");
const router = express.Router();

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");
const authenticateUser = require("../middlewares/authenticateUser");
const isAdmin = require("../middlewares/isAdmin");

router.post("", [authenticateUser(404), isAdmin], createCategory);
router.get("", getCategories);
router.patch("/:id", [authenticateUser(404), isAdmin], updateCategory);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteCategory);

module.exports = router;
