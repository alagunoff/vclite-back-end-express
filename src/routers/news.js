const express = require("express");
const router = express.Router();

const { createNews, getNews, deleteNews } = require("../controllers/news");
const authenticateUser = require("../middlewares/authenticateUser");
const isAdmin = require("../middlewares/isAdmin");
const commentsRouter = require("./comments");

router.post("", [authenticateUser(404), isAdmin], createNews);
router.get("", getNews);
router.delete("/:id", [authenticateUser(404), isAdmin], deleteNews);

router.use("/:newsId/comments", commentsRouter);

module.exports = router;
