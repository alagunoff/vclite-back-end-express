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
  | {
      jwt: string;
    }
  | {
      statusCode: 403 | 404;
    }
> {
  const userToLogIn = await prisma.user.findUnique({ where: { username } });
  if (!userToLogIn) {
    return { statusCode: 404 };
  }

  const isProvidedPasswordCorrect = bcrypt.compareSync(
    password,
    userToLogIn.password
  );
  if (!isProvidedPasswordCorrect) {
    return { statusCode: 403 };
  }

  return { jwt: jwt.sign(String(userToLogIn.id), env.JWT_SECRET_KEY) };
}

export { logIn };
