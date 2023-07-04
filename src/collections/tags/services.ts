import { type Prisma } from "@prisma/client";

import { ApiError } from "shared/errors/classes";
import { DEFAULT_ORDER_PARAMETERS } from "shared/ordering/constants";
import { type PaginationParameters } from "shared/pagination/types";
import { calculatePagesTotalNumber } from "shared/pagination/utils";
import { prisma } from "shared/prisma";

async function createTag(creationData: { name: string }) {
  if (await prisma.tag.findUnique({ where: { name: creationData.name } })) {
    return new ApiError(422);
  }

  await prisma.tag.create({ data: creationData });
}

async function getTags(paginationParameters: PaginationParameters) {
  const tags = await prisma.tag.findMany({
    ...paginationParameters,
    orderBy: DEFAULT_ORDER_PARAMETERS,
  });
  const tagsTotalNumber = await prisma.tag.count();

  return {
    tags,
    tagsTotalNumber,
    pagesTotalNumber: calculatePagesTotalNumber(
      tagsTotalNumber,
      paginationParameters.take
    ),
  };
}

async function updateTag(
  filterParameters: Prisma.TagUpdateArgs["where"],
  updateData: { name?: string }
) {
  if (!(await prisma.tag.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  if (
    updateData.name &&
    (await prisma.tag.findUnique({ where: { name: updateData.name } }))
  ) {
    return new ApiError(422);
  }

  await prisma.tag.update({ where: filterParameters, data: updateData });
}

async function deleteTag(filterParameters: Prisma.TagDeleteArgs["where"]) {
  if (!(await prisma.tag.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  await prisma.tag.delete({ where: filterParameters });
}

export { createTag, getTags, updateTag, deleteTag };
