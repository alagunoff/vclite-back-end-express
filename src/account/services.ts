import jwt from "jsonwebtoken";

import { env } from "shared/env";
import { ApiError } from "shared/errors/classes";
import { hashText } from "shared/hashing/utils";
import { prisma } from "shared/prisma";

async function logIn({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const userToLogIn = await prisma.user.findUnique({ where: { username } });

  if (!userToLogIn || hashText(password) !== userToLogIn.password) {
    return new ApiError(401);
  }

  if (!userToLogIn.verified) {
    return new ApiError(403);
  }

  return jwt.sign({ data: userToLogIn.id }, env.JWT_SECRET_KEY, {
    expiresIn: "1 day",
  });
}

export { logIn };
