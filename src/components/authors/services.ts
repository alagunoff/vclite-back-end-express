import { Prisma, type Author } from "@prisma/client";

import prisma from "src/shared/prisma";
import { type ValidatedPaginationQueryParameters } from "src/shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "src/shared/pagination/utils";

import { type ValidatedCreationData, type ValidatedUpdateData } from "./types";

async function createAuthor(
  { description, userId }: ValidatedCreationData,
  onSuccess: () => void,
  onFailure: (reason?: "userNotFound") => void
): Promise<void> {
  try {
    await prisma.author.create({
      data: {
        description,
        user: {
          connect: typeof userId === "number" ? { id: userId } : undefined,
        },
      },
    });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure("userNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
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
  { description }: ValidatedUpdateData,
  onSuccess: () => void,
  onFailure: (reason?: "authorNotFound") => void
): Promise<void> {
  try {
    await prisma.author.update({ where: { id }, data: { description } });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure("authorNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

async function deleteAuthorById(
  id: number,
  onSuccess: () => void,
  onFailure: (reason?: "authorNotFound") => void
): Promise<void> {
  try {
    await prisma.author.delete({ where: { id } });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure("authorNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

export { createAuthor, getAuthors, updateAuthorById, deleteAuthorById };
