import { type Prisma } from "@prisma/client";

import { prisma } from "shared/database/prisma";
import { ApiError } from "shared/errors/classes";
import { hashText } from "shared/hashing/utils";
import { saveImage, deleteHostedImage } from "shared/images/utils";

async function createUser({
  image,
  username,
  password,
  email,
  firstName,
  lastName,
  verified,
}: {
  image: string;
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  verified: boolean;
}) {
  if (
    (await prisma.user.findUnique({ where: { username } })) ??
    (await prisma.user.findUnique({ where: { email } }))
  ) {
    return new ApiError(422);
  }

  return await prisma.user.create({
    data: {
      image: await saveImage(image, "users", username),
      username,
      password: hashText(password),
      email,
      firstName,
      lastName,
      verified,
    },
  });
}

async function updateUser(
  filterParameters: Prisma.UserWhereUniqueInput,
  { verified }: Prisma.UserUpdateInput
) {
  if (!(await prisma.user.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  await prisma.user.update({ where: filterParameters, data: { verified } });
}

async function deleteUser(filterParameters: Prisma.UserWhereUniqueInput) {
  if (!(await prisma.user.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  const deletedUser = await prisma.user.delete({ where: filterParameters });
  await deleteHostedImage(deletedUser.image);
}

export { createUser, updateUser, deleteUser };
