import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";

import * as userServices from "collections/users/services";
import * as userValidators from "collections/users/validators";
import { HOST_URL } from "shared/constants";
import { emailSender } from "shared/email";
import { env } from "shared/env";
import { ApiError } from "shared/errors/classes";
import { checkIfValueIsPositiveInteger } from "shared/validation/validators";

import * as services from "./services";
import { validateLoginData } from "./validators";

async function register(req: Request, res: Response) {
  const registrationDataValidationErrors = userValidators.validateCreationData(
    req.body
  );

  if (registrationDataValidationErrors) {
    res.status(400).json(registrationDataValidationErrors);
    return;
  }

  const userCreationResult = await userServices.createUser({
    ...req.body,
    verified: false,
  });

  if (userCreationResult instanceof ApiError) {
    res.status(userCreationResult.code).end();
    return;
  }

  await emailSender.sendMail({
    to: userCreationResult.email,
    subject: "Account verification on VClite",
    html: `<p>An account has been registered with this email. If it was you, then <a href="${HOST_URL}/api/verification/${jwt.sign(
      { data: userCreationResult.id },
      env.JWT_SECRET_KEY,
      { expiresIn: "10 minutes" }
    )}" target="_blank" rel="noreferrer">verify</a> your account within 10 minutes, otherwise do nothing.</p>`,
  });

  res.status(201).end();
}

function verifyUser(req: Request, res: Response) {
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

export { register, verifyUser, logIn };
