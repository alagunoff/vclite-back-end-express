import { type Request, type Response } from "express";

import { validateLoginData } from "./validators";
import * as services from "./services";

async function logIn(req: Request, res: Response) {
  const loginDataValidationErrors = validateLoginData(req.body);

  if (loginDataValidationErrors) {
    res.status(400).json(loginDataValidationErrors);
    return;
  }

  const loginResult = await services.logIn(req.body);

  if (typeof loginResult !== "string") {
    res.status(loginResult.code).end();
    return;
  }

  res.send(loginResult);
}

export { logIn };
