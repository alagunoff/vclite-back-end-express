import prisma from "src/shared/prisma/client";
import { type PaginationParameters } from "src/shared/pagination/types";
import { calculatePagesTotalNumber } from "src/shared/pagination/utils";
import { ApiError } from "src/shared/errors/classes";

async function createAuthor({
  description,
  userId,
}: {
  description?: string;
  userId: number;
}) {
  if (!(await prisma.user.findUnique({ where: { id: userId } }))) {
    return new ApiError(422);
  }

  await prisma.author.create({ data: { description, userId } });
}

async function getAuthors(paginationParameters: PaginationParameters) {
  const authors = await prisma.author.findMany({
    ...paginationParameters,
    orderBy: { id: "asc" },
    select: { id: true, description: true },
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
) {
  if (!(await prisma.author.findUnique({ where: { id } }))) {
    return new ApiError(404);
  }

  await prisma.author.update({ where: { id }, data: { description } });
}

async function deleteAuthorById(id: number) {
  if (!(await prisma.author.findUnique({ where: { id } }))) {
    return new ApiError(404);
  }

  await prisma.author.delete({ where: { id } });
}

export { createAuthor, getAuthors, updateAuthorById, deleteAuthorById };
