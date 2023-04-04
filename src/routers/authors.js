const express = require("express");
const router = express.Router();

const {
  createAuthor,
  getAuthors,
  updateAuthor,
  deleteAuthor,
} = require("../controllers/authors");
const authenticateUser = require("../middlewares/authenticateUser");
const isAdmin = require("../middlewares/isAdmin");

router.post("", [authenticateUser(404), isAdmin], createAuthor);
router.get("", [authenticateUser(404), isAdmin], getAuthors);
router.patch("/:id", [authenticateUser(404), isAdmin], updateAuthor);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteAuthor);

module.exports = router;
