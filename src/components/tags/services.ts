import { Prisma, type Tag } from "@prisma/client";

import prisma from "src/shared/prisma";
import { type ValidatedPaginationQueryParameters } from "src/shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "src/shared/pagination/utils";

import { type ValidatedCreationData, type ValidatedUpdateData } from "./types";

async function createTag(
  { name }: ValidatedCreationData,
  onSuccess: () => void,
  onFailure: (reason?: "tagAlreadyExists") => void
): Promise<void> {
  try {
    await prisma.tag.create({ data: { name } });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          onFailure("tagAlreadyExists");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

async function getTags(
  validatedPaginationQueryParameters: ValidatedPaginationQueryParameters,
  onSuccess: (
    tags: Tag[],
    tagsTotalNumber: number,
    pagesTotalNumber: number
  ) => void
): Promise<void> {
  const tags = await prisma.tag.findMany({
    ...createPaginationParameters(validatedPaginationQueryParameters),
    orderBy: {
      id: "asc",
    },
  });
  const tagsTotalNumber = await prisma.tag.count();

  onSuccess(
    tags,
    tagsTotalNumber,
    calculatePagesTotalNumber(tagsTotalNumber, tags.length)
  );
}

async function updateTagById(
  id: number,
  { name }: ValidatedUpdateData,
  onSuccess: () => void,
  onFailure: (reason?: "tagNotFound" | "tagAlreadyExists") => void
): Promise<void> {
  try {
    await prisma.tag.update({
      where: { id },
      data: { name },
    });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure("tagNotFound");
          break;
        case "P2002":
          onFailure("tagAlreadyExists");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

async function deleteTagById(
  id: number,
  onSuccess: () => void,
  onFailure: (reason?: "tagNotFound") => void
): Promise<void> {
  try {
    await prisma.tag.delete({ where: { id } });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure("tagNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

export { createTag, getTags, updateTagById, deleteTagById };
