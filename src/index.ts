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
