import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import prisma from "src/shared/prisma";
import env from "src/shared/env";
import { saveImage, deleteHostedImage } from "src/shared/images/utils";

import { type ValidatedCreationData } from "./types";

async function createUser(
  { image, username, password, firstName, lastName }: ValidatedCreationData,
  onSuccess: (userJwtToken: string) => void,
  onFailure: (reason?: "userAlreadyExists") => void
): Promise<void> {
  try {
    const createdUser = await prisma.user.create({
      data: {
        image: saveImage(image, "users", username),
        username,
        password: bcrypt.hashSync(password),
        firstName,
        lastName,
      },
    });

    onSuccess(jwt.sign(String(createdUser.id), env.JWT_SECRET_KEY));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          onFailure("userAlreadyExists");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

async function deleteUserById(
  id: number,
  onSuccess: () => void,
  onFailure: (reason?: "userNotFound") => void
): Promise<void> {
  try {
    const deletedUser = await prisma.user.delete({ where: { id } });
    deleteHostedImage(deletedUser.image);

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure("userNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

export { createUser, deleteUserById };
