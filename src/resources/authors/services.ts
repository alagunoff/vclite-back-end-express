import prisma from "src/prisma";
import { type PaginationParameters } from "src/shared/pagination/types";
import { calculatePagesTotalNumber } from "src/shared/pagination/utils";

async function createAuthor({
  description,
  userId,
}: {
  description?: string;
  userId: number;
}): Promise<{ status: "success" } | { status: "failure"; errorCode: 422 }> {
  if (!(await prisma.user.findUnique({ where: { id: userId } }))) {
    return { status: "failure", errorCode: 422 };
  }

  await prisma.author.create({ data: { description, userId } });

  return { status: "success" };
}

async function getAuthors(paginationParameters: PaginationParameters) {
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
      paginationParameters.take
    ),
  };
}

async function updateAuthorById(
  id: number,
  { description }: { description?: string }
): Promise<{ status: "success" } | { status: "failure"; errorCode: 404 }> {
  if (!(await prisma.author.findUnique({ where: { id } }))) {
    return { status: "failure", errorCode: 404 };
  }

  await prisma.author.update({ where: { id }, data: { description } });

  return { status: "success" };
}

async function deleteAuthorById(
  id: number
): Promise<{ status: "success" } | { status: "failure"; errorCode: 404 }> {
  if (!(await prisma.author.findUnique({ where: { id } }))) {
    return { status: "failure", errorCode: 404 };
  }

  await prisma.author.delete({ where: { id } });

  return { status: "success" };
}

export { createAuthor, getAuthors, updateAuthorById, deleteAuthorById };
