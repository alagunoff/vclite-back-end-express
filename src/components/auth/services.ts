import { type User } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import prisma from "prisma";

import { type ValidatedLoginData } from "./types";

async function logIn(
  { username, password }: ValidatedLoginData,
  onSuccess: (userJwtToken: string) => void,
  onFailure: () => void
): Promise<void> {
  const user = (await prisma.user.findUnique({ where: { username } })) as User;
  const isProvidedPasswordCorrect = bcrypt.compareSync(password, user.password);

  if (isProvidedPasswordCorrect) {
    onSuccess(jwt.sign(String(user.id), process.env.JWT_SECRET_KEY));
  } else {
    onFailure();
  }
}

export { logIn };
