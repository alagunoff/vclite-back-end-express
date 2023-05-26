import prisma from "src/shared/prisma/client";
import { type PaginationParameters } from "src/shared/pagination/types";
import { calculatePagesTotalNumber } from "src/shared/pagination/utils";
import { ApiError } from "src/shared/errors/classes";

async function createTag({ name }: { name: string }) {
  if (await prisma.tag.findUnique({ where: { name } })) {
    return new ApiError(422);
  }

  await prisma.tag.create({ data: { name } });
}

async function getTags(paginationParameters: PaginationParameters) {
  const tags = await prisma.tag.findMany({
    ...paginationParameters,
    orderBy: {
      id: "asc",
    },
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
