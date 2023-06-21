import { type Request, type Response } from "express";

import { ApiError } from "shared/errors/classes";

import * as services from "./service";
import { validateData } from "./validator";

async function logIn(req: Request, res: Response) {
  const dataValidationErrors = validateData(req.body);

  if (dataValidationErrors) {
    res.status(400).json(dataValidationErrors);
    return;
  }

  const loginResult = await services.logIn(req.body);

  if (loginResult instanceof ApiError) {
    res.status(loginResult.code).end();
    return;
  }

  res.send(loginResult);
}

export { logIn };
