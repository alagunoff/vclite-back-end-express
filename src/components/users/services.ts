import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import prisma from "prisma";
import { saveImage, deleteHostedImage } from "shared/images/utils";

import { type ValidatedCreationData } from "./types";

async function createUser(
  { image, username, password, firstName, lastName }: ValidatedCreationData,
  onSuccess: (userJwtToken: string) => void
): Promise<void> {
  const createdUser = await prisma.user.create({
    data: {
      image: saveImage(image, "users", username),
      username,
      password: bcrypt.hashSync(password),
      firstName,
      lastName,
    },
  });

  onSuccess(jwt.sign(String(createdUser.id), process.env.JWT_SECRET_KEY));
}

async function deleteUserById(
  id: number,
  onSuccess: () => void,
  onFailure: () => void
): Promise<void> {
  try {
    const deletedUser = await prisma.user.delete({ where: { id } });
    deleteHostedImage(deletedUser.image);

    onSuccess();
  } catch (error) {
    console.log(error);

    onFailure();
  }
}

export { createUser, deleteUserById };
