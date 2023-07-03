import { type Prisma } from "@prisma/client";

import { ApiError } from "shared/errors/classes";
import { DEFAULT_ORDER_PARAMETERS } from "shared/ordering/constants";
import { type PaginationParameters } from "shared/pagination/types";
import { calculatePagesTotalNumber } from "shared/pagination/utils";
import { prisma } from "shared/prisma";

async function createAuthor(creationData: {
  description?: string;
  userId: number;
}) {
  if (!(await prisma.user.findUnique({ where: { id: creationData.userId } }))) {
    return new ApiError(422);
  }

  await prisma.author.create({ data: creationData });
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

async function updateAuthor(
  filterParameters: Prisma.AuthorUpdateArgs["where"],
  updateData: { description?: string }
) {
  if (!(await prisma.author.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  await prisma.author.update({
    where: filterParameters,
    data: updateData,
  });
}

async function deleteAuthor(
  filterParameters: Prisma.AuthorDeleteArgs["where"]
) {
  if (!(await prisma.author.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  await prisma.author.delete({ where: filterParameters });
}

export { createAuthor, getAuthors, updateAuthor, deleteAuthor };
