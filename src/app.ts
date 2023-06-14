import compression from "compression";
import cors from "cors";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import authRouter from "./auth/router";
import authorsRouter from "./resources/authors/router";
import categoriesRouter from "./resources/categories/router";
import draftsRouter from "./resources/drafts/router";
import postsRouter from "./resources/posts/router";
import tagsRouter from "./resources/tags/router";
import usersRouter from "./resources/users/router";
import { projectAbsolutePath } from "./shared/constants";
import env from "./shared/env";
import { handleError } from "./shared/errors/middlewares";
import apiDocs from "../api-docs.json";

const app = express();

if (!env.isProd) {
  app.use(cors());
}

app.use(express.json());
app.use(helmet());
app.use(compression());
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

export default app;
