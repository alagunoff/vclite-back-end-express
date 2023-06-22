import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";

import * as userServices from "collections/users/services";
import { env } from "shared/env";
import { ApiError } from "shared/errors/classes";
import { checkIfValueIsPositiveInteger } from "shared/validation/validators";

import * as services from "./services";
import { validateLoginData } from "./validators";

function verifyAccount(req: Request, res: Response) {
  jwt.verify(
    req.params.jwt,
    env.JWT_SECRET_KEY,
    async (error, decodedPayload) => {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(422).end();
        return;
      }

      if (
        error ??
        (typeof decodedPayload !== "object" ||
          !checkIfValueIsPositiveInteger(decodedPayload.data))
      ) {
        res.status(400).end();
        return;
      }

      const userUpdateError = await userServices.updateUser(
        { id: decodedPayload.data, verified: false },
        { verified: true }
      );

      if (userUpdateError) {
        res.status(userUpdateError.code).end();
        return;
      }

      res.end();
    }
  );
}

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

export { verifyAccount, logIn };
