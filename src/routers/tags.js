const express = require("express");
const router = express.Router();

const {
  createTag,
  getTags,
  updateTag,
  deleteTag,
} = require("../controllers/tags");
const authenticateUser = require("../middlewares/authenticateUser");
const isAdmin = require("../middlewares/isAdmin");

router.post("", [authenticateUser(404), isAdmin], createTag);
router.get("", getTags);
router.patch("/:id", [authenticateUser(404), isAdmin], updateTag);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteTag);

module.exports = router;
