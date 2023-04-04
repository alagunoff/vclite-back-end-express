const express = require("express");
const router = express.Router();

const { createTag, getTags } = require("../controllers/tags");
const authenticateUser = require("../middlewares/authenticateUser");
const isAdmin = require("../middlewares/isAdmin");

router.post("", [authenticateUser(404), isAdmin], createTag);
router.get("", getTags);

module.exports = router;
