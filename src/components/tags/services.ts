import { type Tag } from "@prisma/client";

import prisma from "src/shared/prisma";
import { type ValidatedPaginationQueryParameters } from "src/shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "src/shared/pagination/utils";

import { type ValidatedCreationData, type ValidatedUpdateData } from "./types";

async function createTag(
  { name }: ValidatedCreationData,
  onSuccess: () => void
): Promise<void> {
  await prisma.tag.create({ data: { name } });

  onSuccess();
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
  onSuccess: () => void
): Promise<void> {
  await prisma.tag.update({ where: { id }, data: { name } });

  onSuccess();
}

async function deleteTagById(
  id: number,
  onSuccess: () => void,
  onFailure: () => void
): Promise<void> {
  try {
    await prisma.tag.delete({ where: { id } });

    onSuccess();
  } catch (error) {
    console.log(error);

    onFailure();
  }
}

export { createTag, getTags, updateTagById, deleteTagById };
