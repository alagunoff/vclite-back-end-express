import { type Request, type Response } from "express";

import { validateLoginData } from "./validators";
import * as services from "./services";

function logIn(req: Request, res: Response): void {
  const {
    validatedData: validatedLoginData,
    errors: loginDataValidationErrors,
  } = validateLoginData(req.body);

  if (loginDataValidationErrors) {
    res.status(400).json(loginDataValidationErrors);
  } else {
    void services.logIn(
      validatedLoginData,
      (userJwtToken) => {
        res.send(userJwtToken);
      },
      (failureReason) => {
        switch (failureReason) {
          case "userNotFound":
            res.status(404).end();
            break;
          case "incorrectPassword":
            res.status(403).end();
            break;
        }
      }
    );
  }
}

export { logIn };
