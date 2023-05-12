import { type Request, type Response } from "express";

import { validateLoginData } from "./validators";
import * as services from "./services";
import { LOGIN_FAILURE_REASON_TO_RESPONSE_STATUS_CODE } from "./constants";

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
        res
          .status(LOGIN_FAILURE_REASON_TO_RESPONSE_STATUS_CODE[failureReason])
          .end();
      }
    );
  }
}

export { logIn };
