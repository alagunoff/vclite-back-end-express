import prisma from "src/shared/prisma";
import { type PaginationParameters } from "src/shared/pagination/types";
import { calculatePagesTotalNumber } from "src/shared/pagination/utils";

async function createTag({
  name,
}: {
  name: string;
}): Promise<{ status: "success" } | { status: "failure"; errorCode: 422 }> {
  if (await prisma.tag.findUnique({ where: { name } })) {
    return {
      status: "failure",
      errorCode: 422,
    };
  }

  await prisma.tag.create({ data: { name } });

  return { status: "success" };
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

async function updateTagById(
  id: number,
  { name }: { name?: string }
): Promise<
  { status: "success" } | { status: "failure"; errorCode: 404 | 422 }
> {
  if (!(await prisma.tag.findUnique({ where: { id } }))) {
    return { status: "failure", errorCode: 404 };
  }

  if (name && (await prisma.tag.findUnique({ where: { name } }))) {
    return { status: "failure", errorCode: 422 };
  }

  await prisma.tag.update({ where: { id }, data: { name } });

  return { status: "success" };
}

async function deleteTagById(
  id: number
): Promise<{ status: "success" } | { status: "failure"; errorCode: 404 }> {
  if (!(await prisma.tag.findUnique({ where: { id } }))) {
    return { status: "failure", errorCode: 404 };
  }

  await prisma.tag.delete({ where: { id } });

  return { status: "success" };
}

export { createTag, getTags, updateTagById, deleteTagById };
