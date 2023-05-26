import express from "express";
import "express-async-errors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import apiDocs from "../api-docs.json";
import authRouter from "./auth/router";
import usersRouter from "./resources/users/router";
import authorsRouter from "./resources/authors/router";
import tagsRouter from "./resources/tags/router";
import categoriesRouter from "./resources/categories/router";
import postsRouter from "./resources/posts/router";
import draftsRouter from "./resources/drafts/router";
import { projectAbsolutePath } from "./shared/app/constants";
import { handleError } from "./shared/errors/middlewares";

const app = express();
app.listen(3000);
app.use(express.json());
app.use(helmet());

app.use("/api/static", express.static(`${projectAbsolutePath}/static`));
app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/authors", authorsRouter);
app.use("/api/tags", tagsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/posts", postsRouter);
app.use("/api/drafts", draftsRouter);
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(apiDocs));
app.use(handleError);
