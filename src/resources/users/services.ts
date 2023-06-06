import jwt from "jsonwebtoken";

import env from "shared/env";
import { ApiError } from "shared/errors/classes";
import { hashPassword } from "shared/hashing/utils";
import { saveImage, deleteHostedImage } from "shared/images/utils";
import prisma from "shared/prisma";

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
}) {
  if (await prisma.user.findUnique({ where: { username } })) {
    return new ApiError(422);
  }

  const createdUser = await prisma.user.create({
    data: {
      image: saveImage(image, "users", username),
      username,
      password: hashPassword(password),
      firstName,
      lastName,
    },
  });

  return jwt.sign(String(createdUser.id), env.JWT_SECRET_KEY);
}

async function deleteUserById(id: number) {
  if (!(await prisma.user.findUnique({ where: { id } }))) {
    return new ApiError(404);
  }

  const deletedUser = await prisma.user.delete({ where: { id } });
  deleteHostedImage(deletedUser.image);
}

export { createUser, deleteUserById };
