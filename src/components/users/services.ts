import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import prisma from "src/shared/prisma";
import env from "src/shared/env";
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
  | {
      status: "success";
      jwt: string;
    }
  | {
      status: "failure";
      errorCode: 422 | 500;
    }
> {
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

    return {
      status: "success",
      jwt: jwt.sign(String(createdUser.id), env.JWT_SECRET_KEY),
    };
  } catch (error) {
    return {
      status: "failure",
      errorCode:
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
          ? 422
          : 500,
    };
  }
}

async function deleteUserById(id: number): Promise<{
  statusCode: 204 | 404 | 500;
}> {
  try {
    const deletedUser = await prisma.user.delete({ where: { id } });
    deleteHostedImage(deletedUser.image);

    return { statusCode: 204 };
  } catch (error) {
    return {
      statusCode:
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
          ? 404
          : 500,
    };
  }
}

export { createUser, deleteUserById };
