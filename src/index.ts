import express from "express";
import dotenv from "dotenv";

import {
  usersRouter,
  authRouter,
  authorsRouter,
  tagsRouter,
  categoriesRouter,
  postsRouter,
} from "routers";
// const postsRouter = require('./src/routers/posts')
// const draftsRouter = require('./src/routers/drafts')

dotenv.config();

const app = express();
app.listen(3000);
app.use(express.json());
app.use("/static", express.static("static"));
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/authors", authorsRouter);
app.use("/tags", tagsRouter);
app.use("/categories", categoriesRouter);
app.use("/posts", postsRouter);
// app.use('/drafts', draftsRouter)
