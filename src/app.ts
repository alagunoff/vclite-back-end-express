import compression from "compression";
import cors from "cors";
import express from "express";
import "express-async-errors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import * as authRouter from "./auth/router";
import * as authorsRouter from "./resources/authors/router";
import * as categoriesRouter from "./resources/categories/router";
import * as draftsRouter from "./resources/drafts/router";
import * as postsRouter from "./resources/posts/router";
import * as tagsRouter from "./resources/tags/router";
import * as usersRouter from "./resources/users/router";
import { projectAbsolutePath } from "./shared/constants";
import { handleError } from "./shared/errors/middlewares";
import apiDocs from "../api-docs.json";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use("/api/static", express.static(`${projectAbsolutePath}/static`));
app.use("/api/auth", authRouter.router);
app.use("/api/users", usersRouter.router);
app.use("/api/authors", authorsRouter.router);
app.use("/api/tags", tagsRouter.router);
app.use("/api/categories", categoriesRouter.router);
app.use("/api/posts", postsRouter.router);
app.use("/api/drafts", draftsRouter.router);
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(apiDocs));
app.use(handleError);

export { app };
