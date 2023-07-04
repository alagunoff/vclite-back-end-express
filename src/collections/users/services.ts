import { type Prisma } from "@prisma/client";

import { ApiError } from "shared/errors/classes";
import { hashText } from "shared/hashing/utils";
import { saveImage, deleteHostedImage } from "shared/images/utils";
import { prisma } from "shared/prisma";

async function createUser(creationData: {
  image: string;
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  verified: boolean;
}) {
  if (
    (await prisma.user.findUnique({
      where: { username: creationData.username },
    })) ??
    (await prisma.user.findUnique({ where: { email: creationData.email } }))
  ) {
    return new ApiError(422);
  }

  return await prisma.user.create({
    data: {
      image: await saveImage(
        creationData.image,
        "users",
        creationData.username
      ),
      username: creationData.username,
      password: hashText(creationData.password),
      email: creationData.email,
      firstName: creationData.firstName,
      lastName: creationData.lastName,
      verified: creationData.verified,
    },
  });
}

async function updateUser(
  filterParameters: Prisma.UserUpdateArgs["where"],
  updateData: { verified?: boolean }
) {
  if (!(await prisma.user.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  await prisma.user.update({ where: filterParameters, data: updateData });
}

async function deleteUser(filterParameters: Prisma.UserDeleteArgs["where"]) {
  if (!(await prisma.user.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  const deletedUser = await prisma.user.delete({ where: filterParameters });
  await deleteHostedImage(deletedUser.image);
}

export { createUser, updateUser, deleteUser };
