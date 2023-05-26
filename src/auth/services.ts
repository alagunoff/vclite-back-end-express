import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import env from "src/shared/env";
import prisma from "src/shared/prisma/client";
import { ApiError } from "src/shared/errors/classes";

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

  const isProvidedPasswordCorrect = bcrypt.compareSync(
    password,
    userToLogIn.password
  );

  if (!isProvidedPasswordCorrect) {
    return new ApiError(403);
  }

  return jwt.sign(String(userToLogIn.id), env.JWT_SECRET_KEY);
}

export { logIn };
