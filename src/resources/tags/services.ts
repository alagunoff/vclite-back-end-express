import { ApiError } from "shared/errors/classes";
import { DEFAULT_ORDER_PARAMETERS } from "shared/ordering/constants";
import { type PaginationParameters } from "shared/pagination/types";
import { calculatePagesTotalNumber } from "shared/pagination/utils";
import { prisma } from "shared/prisma";

async function createTag({ name }: { name: string }) {
  if (await prisma.tag.findUnique({ where: { name } })) {
    return new ApiError(422);
  }

  await prisma.tag.create({ data: { name } });
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

async function updateTagById(id: number, { name }: { name?: string }) {
  if (!(await prisma.tag.findUnique({ where: { id } }))) {
    return new ApiError(404);
  }

  if (name && (await prisma.tag.findUnique({ where: { name } }))) {
    return new ApiError(422);
  }

  await prisma.tag.update({ where: { id }, data: { name } });
}

async function deleteTagById(id: number) {
  if (!(await prisma.tag.findUnique({ where: { id } }))) {
    return new ApiError(404);
  }

  await prisma.tag.delete({ where: { id } });
}

export { createTag, getTags, updateTagById, deleteTagById };
