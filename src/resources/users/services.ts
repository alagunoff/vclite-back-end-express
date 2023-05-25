import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import prisma from "src/prisma";
import env from "src/env";
import { saveImage, deleteHostedImage } from "src/shared/images/utils";

async function createUser({
  image,
  username,
  password,
  firstName,
  lastName,
}: {
  image: string;
  username: string;
  password: string;
  firstName?: string;
  lastName?: string;
}): Promise<
  { status: "success"; jwt: string } | { status: "failure"; errorCode: 422 }
> {
  if (await prisma.user.findUnique({ where: { username } })) {
    return { status: "failure", errorCode: 422 };
  }

  const createdUser = await prisma.user.create({
    data: {
      image: saveImage(image, "users", username),
      username,
      password: bcrypt.hashSync(password),
      firstName,
      lastName,
    },
  });

  return {
    status: "success",
    jwt: jwt.sign(String(createdUser.id), env.JWT_SECRET_KEY),
  };
}

async function deleteUserById(
  id: number
): Promise<{ status: "success" } | { status: "failure"; errorCode: 404 }> {
  if (!(await prisma.user.findUnique({ where: { id } }))) {
    return { status: "failure", errorCode: 404 };
  }

  const deletedUser = await prisma.user.delete({ where: { id } });
  deleteHostedImage(deletedUser.image);

  return { status: "success" };
}

export { createUser, deleteUserById };
