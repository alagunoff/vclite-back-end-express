import { type Request, type Response } from "express";

import { validateLoginData } from "./validators";
import * as services from "./services";

async function logIn(req: Request, res: Response): Promise<void> {
  const loginDataValidationErrors = validateLoginData(req.body);
  if (loginDataValidationErrors) {
    res.status(400).json(loginDataValidationErrors);
    return;
  }

  const loginResult = await services.logIn(req.body);
  "jwt" in loginResult
    ? res.send(loginResult.jwt)
    : res.status(loginResult.statusCode).end();
}

export { logIn };
