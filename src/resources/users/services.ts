import nodemailer from "nodemailer";

import { ApiError } from "shared/errors/classes";
import { hashPassword } from "shared/hashing/utils";
import { saveImage, deleteHostedImage } from "shared/images/utils";
import prisma from "shared/prisma";

async function createUser({
  image,
  username,
  password,
  email,
  firstName,
  lastName,
}: {
  image: string;
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
}) {
  if (await prisma.user.findUnique({ where: { username } })) {
    return new ApiError(422);
  }

  await prisma.user.create({
    data: {
      image: saveImage(image, "users", username),
      username,
      password: hashPassword(password),
      email,
      firstName,
      lastName,
    },
  });

  await nodemailer
    .createTransport({
      host: "smtp.freesmtpservers.com",
      port: 25,
    })
    .sendMail({
      from: "oleg@oleg.com",
      to: email,
      subject: "Email confirmation",
      text: "Hi",
    });
}

async function deleteUserById(id: number) {
  if (!(await prisma.user.findUnique({ where: { id } }))) {
    return new ApiError(404);
  }

  const deletedUser = await prisma.user.delete({ where: { id } });
  deleteHostedImage(deletedUser.image);
}

export { createUser, deleteUserById };
