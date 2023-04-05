const express = require("express");
const router = express.Router();

const { createUser, getUser, deleteUser } = require("../controllers/users");
const { authenticateUser, isAdmin } = require("../middlewares/auth");

router.post("", createUser);
router.get("", authenticateUser(), getUser);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteUser);

module.exports = router;
