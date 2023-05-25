import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import env from "src/shared/env";
import prisma from "src/shared/prisma";

async function logIn({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<
  | { status: "success"; jwt: string }
  | { status: "failure"; errorCode: 403 | 404 }
> {
  const userToLogIn = await prisma.user.findUnique({ where: { username } });

  if (!userToLogIn) {
    return { status: "failure", errorCode: 404 };
  }

  const isProvidedPasswordCorrect = bcrypt.compareSync(
    password,
    userToLogIn.password
  );

  if (!isProvidedPasswordCorrect) {
    return { status: "failure", errorCode: 403 };
  }

  return {
    status: "success",
    jwt: jwt.sign(String(userToLogIn.id), env.JWT_SECRET_KEY),
  };
}

export { logIn };
