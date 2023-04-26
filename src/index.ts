import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import {
  authRouter,
  usersRouter,
  authorsRouter,
  tagsRouter,
  categoriesRouter,
  postsRouter,
  draftsRouter,
} from "routers";

import apiDocs from "../api-docs.json";

dotenv.config();

const app = express();

app.listen(3000);
app.use(express.json());
app.use("/static", express.static("static"));
app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/authors", authorsRouter);
app.use("/tags", tagsRouter);
app.use("/categories", categoriesRouter);
app.use("/posts", postsRouter);
app.use("/drafts", draftsRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocs));
