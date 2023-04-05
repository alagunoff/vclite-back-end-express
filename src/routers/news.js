const express = require("express");
const router = express.Router();

const { createNews, getNews } = require("../controllers/news");
const authenticateUser = require("../middlewares/authenticateUser");
const isAdmin = require("../middlewares/isAdmin");

router.post("", [authenticateUser(404), isAdmin], createNews);
router.get("", getNews);

module.exports = router;
