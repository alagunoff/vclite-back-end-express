import { type Tag } from "@prisma/client";

import prisma from "src/shared/prisma";
import { type ValidatedPaginationQueryParameters } from "src/shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "src/shared/pagination/utils";

import { type ValidatedCreationData, type ValidatedUpdateData } from "./types";
import { type UPDATE_FAILURE_REASON_TO_RESPONSE_STATUS_CODE } from "./constants";

async function createTag(
  { name }: ValidatedCreationData,
  onSuccess: () => void,
  onFailure: () => void
): Promise<void> {
  try {
    await prisma.tag.create({ data: { name } });

    onSuccess();
  } catch {
    onFailure();
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
  onFailure: (
    reason: keyof typeof UPDATE_FAILURE_REASON_TO_RESPONSE_STATUS_CODE
  ) => void
): Promise<void> {
  const tagToUpdate = await prisma.tag.findUnique({ where: { id } });

  if (tagToUpdate) {
    try {
      await prisma.tag.update({ where: { id }, data: { name } });

      onSuccess();
    } catch {
      onFailure("tagAlreadyExists");
    }
  } else {
    onFailure("tagNotFound");
  }
}

async function deleteTagById(
  id: number,
  onSuccess: () => void,
  onFailure: () => void
): Promise<void> {
  try {
    await prisma.tag.delete({ where: { id } });

    onSuccess();
  } catch {
    onFailure();
  }
}

export { createTag, getTags, updateTagById, deleteTagById };
