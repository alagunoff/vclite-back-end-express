/* eslint-disable import/first */
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import swaggerUi from "swagger-ui-express";

import authRouter from "components/auth/router";
import usersRouter from "components/users/router";
import authorsRouter from "components/authors/router";
import tagsRouter from "components/tags/router";
import categoriesRouter from "components/categories/router";
import postsRouter from "components/posts/router";
import draftsRouter from "components/drafts/router";

import apiDocs from "../api-docs.json";

dotenv.config();

const app = express();

app.listen(3000);

app.use(express.json());
app.use("/api/static", express.static("static"));
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/posts", postsRouter);
app.use("/api/drafts", draftsRouter);
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(apiDocs));
