import compression from "compression";
import cors from "cors";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import "express-async-errors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";

import * as accountRouter from "./account/router";
import * as authorsRouter from "./collections/authors/router";
import * as categoriesRouter from "./collections/categories/router";
import * as draftsRouter from "./collections/drafts/router";
import * as postsRouter from "./collections/posts/router";
import * as tagsRouter from "./collections/tags/router";
import * as usersRouter from "./collections/users/router";
import { projectAbsolutePath } from "./shared/constants";
import apiDocs from "../api-docs.json";

const app = express();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use("/api/static", express.static(`${projectAbsolutePath}/static`));
app.use("/api/account", accountRouter.router);
app.use("/api/users", usersRouter.router);
app.use("/api/authors", authorsRouter.router);
app.use("/api/tags", tagsRouter.router);
app.use("/api/categories", categoriesRouter.router);
app.use("/api/posts", postsRouter.router);
app.use("/api/drafts", draftsRouter.router);
app.use("/api/swagger", swaggerUi.serve, swaggerUi.setup(apiDocs));
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.log(error);

  res.status(500).end();
});

export { app };
