import jwt from "jsonwebtoken";

import env from "src/shared/env";
import prisma from "src/shared/prisma/client";
import { ApiError } from "src/shared/errors/classes";
import { hashPassword } from "src/shared/hashing/utils";

async function logIn({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const userToLogIn = await prisma.user.findUnique({ where: { username } });

  if (!userToLogIn) {
    return new ApiError(404);
  }

  if (hashPassword(password) !== userToLogIn.password) {
    return new ApiError(403);
  }

  return jwt.sign(String(userToLogIn.id), env.JWT_SECRET_KEY);
}

export { logIn };
