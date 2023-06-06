import { type Request, type Response } from "express";

import { ApiError } from "shared/errors/classes";

import * as services from "./services";
import { validateLoginData } from "./validators";

async function logIn(req: Request, res: Response) {
  const loginDataValidationErrors = validateLoginData(req.body);

  if (loginDataValidationErrors) {
    res.status(400).json(loginDataValidationErrors);
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
