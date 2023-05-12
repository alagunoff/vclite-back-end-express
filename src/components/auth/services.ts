import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import env from "src/shared/env";
import prisma from "src/shared/prisma";

import { type ValidatedLoginData } from "./types";
import { type FAILURE_REASON_TO_RESPONSE_STATUS_CODE } from "./constants";

async function logIn(
  { username, password }: ValidatedLoginData,
  onSuccess: (userJwtToken: string) => void,
  onFailure: (
    reason: keyof typeof FAILURE_REASON_TO_RESPONSE_STATUS_CODE
  ) => void
): Promise<void> {
  const user = await prisma.user.findUnique({ where: { username } });

  if (user) {
    const isProvidedPasswordCorrect = bcrypt.compareSync(
      password,
      user.password
    );

    if (isProvidedPasswordCorrect) {
      onSuccess(jwt.sign(String(user.id), env.JWT_SECRET_KEY));
    } else {
      onFailure("incorrectPassword");
    }
  } else {
    onFailure("userNotFound");
  }
}

export { logIn };
