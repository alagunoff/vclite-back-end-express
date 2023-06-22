import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";

import * as userServices from "collections/users/services";
import { env } from "shared/env";
import { checkIfValueIsPositiveInteger } from "shared/validation/validators";

function verifyAccount(req: Request, res: Response) {
  jwt.verify(
    req.params.encodedJwt,
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

export { verifyAccount };
