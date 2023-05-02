import { type Author } from "@prisma/client";

import prisma from "prisma";
import { type ValidatedPaginationQueryParameters } from "shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/pagination/utils";

async function createAuthor(
  { description, userId }: { description: string | undefined; userId: number },
  onSuccess: () => void
): Promise<void> {
  await prisma.author.create({ data: { description, userId } });

  onSuccess();
}

async function getAuthors(
  validatedPaginationQueryParameters: ValidatedPaginationQueryParameters,
  onSuccess: (
    authors: Array<Omit<Author, "userId">>,
    authorsTotalNumber: number,
    pagesTotalNumber: number
  ) => void
): Promise<void> {
  const authors = await prisma.author.findMany({
    ...createPaginationParameters(validatedPaginationQueryParameters),
    select: {
      id: true,
      description: true,
    },
  });
  const authorsTotalNumber = await prisma.author.count();

  onSuccess(
    authors,
    authorsTotalNumber,
    calculatePagesTotalNumber(authorsTotalNumber, authors.length)
  );
}

async function updateAuthorById(
  id: number,
  {
    description,
  }: {
    description: string | undefined;
  },
  onSuccess: () => void
): Promise<void> {
  await prisma.author.update({ where: { id }, data: { description } });

  onSuccess();
}

async function deleteAuthorById(
  id: number,
  onSuccess: () => void,
  onFailure: () => void
): Promise<void> {
  try {
    await prisma.author.delete({ where: { id } });

    onSuccess();
  } catch (error) {
    console.log(error);

    onFailure();
  }
}

export { createAuthor, getAuthors, updateAuthorById, deleteAuthorById };
