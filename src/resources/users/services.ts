import env from "shared/env";
import { ApiError } from "shared/errors/classes";
import { hashPassword } from "shared/hashing/utils";
import { saveImage, deleteHostedImage } from "shared/images/utils";
import prisma from "shared/prisma";
import { transporter } from "shared/transporter";

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
      image: await saveImage(image, "users", username),
      username,
      password: hashPassword(password),
      email,
      firstName,
      lastName,
    },
  });
  await transporter.sendMail({
    from: env.SMTP_SENDER,
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
  await deleteHostedImage(deletedUser.image);
}

export { createUser, deleteUserById };
