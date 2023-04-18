import express from "express";
import dotenv from "dotenv";

dotenv.config();

const db = require("./src/configs/db");
const authRouter = require("./src/routers/auth");
const usersRouter = require("./src/routers/users");
const authorsRouter = require("./src/routers/authors");
const postsRouter = require("./src/routers/posts");
const draftsRouter = require("./src/routers/drafts");
const categoriesRouter = require("./src/routers/categories");
const tagsRouter = require("./src/routers/tags");

const app = express();
app.listen(3000);
app.use("/static", express.static("static"));
app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/authors", authorsRouter);
app.use("/posts", postsRouter);
app.use("/drafts", draftsRouter);
app.use("/categories", categoriesRouter);
app.use("/tags", tagsRouter);

db.sync({ alter: true });
