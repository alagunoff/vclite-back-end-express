import prisma from "src/prisma";
import { type PaginationParameters } from "src/shared/pagination/types";
import { calculatePagesTotalNumber } from "src/shared/pagination/utils";

import { includeSubcategories } from "./utils";

async function createCategory({
  name,
  parentCategoryId,
}: {
  name: string;
  parentCategoryId?: number;
}): Promise<
  { status: "success" } | { status: "failure"; errorCode: 422; reason: string }
> {
  if (await prisma.category.findUnique({ where: { name } })) {
    return {
      status: "failure",
      errorCode: 422,
      reason: "categoryAlreadyExists",
    };
  }

  if (
    parentCategoryId &&
    !(await prisma.category.findUnique({ where: { id: parentCategoryId } }))
  ) {
    return {
      status: "failure",
      errorCode: 422,
      reason: "parentCategoryNotFound",
    };
  }

  await prisma.category.create({
    data: {
      name,
      parentCategory: {
        connect: parentCategoryId ? { id: parentCategoryId } : undefined,
      },
    },
  });

  return { status: "success" };
}

async function getCategories(paginationParameters: PaginationParameters) {
  const filterParameters = { parentCategoryId: null };
  const categories = await prisma.category.findMany({
    where: filterParameters,
    ...paginationParameters,
    orderBy: {
      id: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });
  const categoriesTotalNumber = await prisma.category.count({
    where: filterParameters,
  });

  for (const category of categories) {
    await includeSubcategories(category);
  }

  return {
    categories,
    categoriesTotalNumber,
    pagesTotalNumber: calculatePagesTotalNumber(
      categoriesTotalNumber,
      paginationParameters.take
    ),
  };
}

async function updateCategoryById(
  id: number,
  {
    name,
    parentCategoryId,
  }: { name?: string; parentCategoryId?: number | null }
): Promise<
  | { status: "success" }
  | { status: "failure"; errorCode: 404 }
  | { status: "failure"; errorCode: 422; reason: string }
> {
  if (!(await prisma.category.findUnique({ where: { id } }))) {
    return {
      status: "failure",
      errorCode: 404,
    };
  }

  if (name && (await prisma.category.findUnique({ where: { name } }))) {
    return {
      status: "failure",
      errorCode: 422,
      reason: "categoryAlreadyExists",
    };
  }

  if (
    parentCategoryId &&
    !(await prisma.category.findUnique({ where: { id: parentCategoryId } }))
  ) {
    return {
      status: "failure",
      errorCode: 422,
      reason: "parentCategoryNotFound",
    };
  }

  await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      parentCategoryId,
    },
  });

  return { status: "success" };
}

async function deleteCategoryById(
  id: number
): Promise<{ status: "success" } | { status: "failure"; errorCode: 404 }> {
  if (!(await prisma.category.findUnique({ where: { id } }))) {
    return {
      status: "failure",
      errorCode: 404,
    };
  }

  await prisma.category.delete({ where: { id } });

  return { status: "success" };
}

export {
  createCategory,
  getCategories,
  updateCategoryById,
  deleteCategoryById,
};
