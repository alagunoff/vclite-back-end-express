import { ApiError } from "shared/errors/classes";
import { DEFAULT_ORDER_PARAMETERS } from "shared/ordering/constants";
import { type PaginationParameters } from "shared/pagination/types";
import { calculatePagesTotalNumber } from "shared/pagination/utils";
import prisma from "shared/prisma";

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
    orderBy: DEFAULT_ORDER_PARAMETERS,
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
