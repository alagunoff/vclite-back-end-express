// import { HOST_URL } from "shared/constants";
// import { env } from "shared/env";
import { ApiError } from "shared/errors/classes";
import { hashText } from "shared/hashing/utils";
import { saveImage, deleteHostedImage } from "shared/images/utils";
import { prisma } from "shared/prisma";
// import { transporter } from "shared/transporter";

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
      password: hashText(password),
      email,
      firstName,
      lastName,
    },
  });

  // await transporter.sendMail({
  //   from: env.SMTP_SENDER,
  //   to: email,
  //   subject: "Account verification on VClite",
  //   html: `<p>An account has been registered with this email. If it was you, then <a href="${HOST_URL}/api/account-verification?userId=${createdUser.id}&code=${accountVerificationCode}" target="_blank" rel="noreferrer">verify</a> your account, otherwise do nothing.</p>`,
  // });
}

async function deleteUserById(id: number) {
  if (!(await prisma.user.findUnique({ where: { id } }))) {
    return new ApiError(404);
  }

  const deletedUser = await prisma.user.delete({ where: { id } });
  await deleteHostedImage(deletedUser.image);
}

export { createUser, deleteUserById };
