import { type Request, type Response } from "express";

import * as services from "./services";
import { validateLoginData } from "./utils";

async function logIn(req: Request, res: Response): Promise<void> {
  const loginDataValidationErrors = await validateLoginData(req.body);

  if (loginDataValidationErrors) {
    res.status(400).json(loginDataValidationErrors);
  } else {
    void services.logIn(
      {
        username: req.body.username,
        password: req.body.password,
      },
      (userJwtToken) => {
        res.send(userJwtToken);
      },
      () => {
        res.status(403).end();
      }
    );
  }
}

export { logIn };
