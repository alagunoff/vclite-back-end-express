import { type Author } from "@prisma/client";

import prisma from "src/shared/prisma";
import { calculatePagesTotalNumber } from "src/shared/pagination/utils";

async function createAuthor({
  description,
  userId,
}: {
  description?: string;
  userId: number;
}): Promise<{ status: "success" } | { status: "failure"; errorCode: 422 }> {
  const userToCreateAuthorFor = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userToCreateAuthorFor) {
    return {
      status: "failure",
      errorCode: 422,
    };
  }

  await prisma.author.create({ data: { description, userId } });

  return {
    status: "success",
  };
}

async function getAuthors(
  paginationParameters:
    | {
        skip?: number;
        take?: number;
      }
    | undefined
): Promise<{
  authors: Array<Omit<Author, "userId">>;
  authorsTotalNumber: number;
  pagesTotalNumber: number;
}> {
  const authors = await prisma.author.findMany({
    ...paginationParameters,
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      description: true,
    },
  });
  const authorsTotalNumber = await prisma.author.count();

  return {
    authors,
    authorsTotalNumber,
    pagesTotalNumber: calculatePagesTotalNumber(
      authorsTotalNumber,
      authors.length
    ),
  };
}

async function updateAuthorById(
  id: number,
  { description }: { description?: string }
): Promise<{ status: "success" } | { status: "failure"; errorCode: 404 }> {
  const authorToUpdate = await prisma.author.findUnique({ where: { id } });

  if (!authorToUpdate) {
    return {
      status: "failure",
      errorCode: 404,
    };
  }

  await prisma.author.update({
    where: { id: authorToUpdate.id },
    data: { description },
  });

  return {
    status: "success",
  };
}

async function deleteAuthorById(
  id: number
): Promise<{ status: "success" } | { status: "failure"; errorCode: 404 }> {
  const authorToDelete = prisma.author.findUnique({ where: { id } });

  if (!authorToDelete) {
    return {
      status: "failure",
      errorCode: 404,
    };
  }

  await prisma.author.delete({ where: { id } });

  return { status: "success" };
}

export { createAuthor, getAuthors, updateAuthorById, deleteAuthorById };
