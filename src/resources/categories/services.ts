import prisma from "src/shared/prisma/client";
import { DEFAULT_ORDER_PARAMETERS } from "src/shared/ordering/constants";
import { type PaginationParameters } from "src/shared/pagination/types";
import { calculatePagesTotalNumber } from "src/shared/pagination/utils";
import { ApiError } from "src/shared/errors/classes";

import { includeSubcategories } from "./utils";

async function createCategory({
  name,
  parentCategoryId,
}: {
  name: string;
  parentCategoryId?: number;
}) {
  if (await prisma.category.findUnique({ where: { name } })) {
    return new ApiError(422, "categoryAlreadyExists");
  }

  if (
    parentCategoryId &&
    !(await prisma.category.findUnique({ where: { id: parentCategoryId } }))
  ) {
    return new ApiError(422, "parentCategoryNotFound");
  }

  await prisma.category.create({
    data: {
      name,
      parentCategory: {
        connect: parentCategoryId ? { id: parentCategoryId } : undefined,
      },
    },
  });
}

async function getCategories(paginationParameters: PaginationParameters) {
  const filterParameters = { parentCategoryId: null };
  const categories = await prisma.category.findMany({
    where: filterParameters,
    ...paginationParameters,
    orderBy: DEFAULT_ORDER_PARAMETERS,
    select: { id: true, name: true },
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
) {
  if (!(await prisma.category.findUnique({ where: { id } }))) {
    return new ApiError(404);
  }

  if (name && (await prisma.category.findUnique({ where: { name } }))) {
    return new ApiError(422, "categoryAlreadyExists");
  }

  if (
    parentCategoryId &&
    !(await prisma.category.findUnique({ where: { id: parentCategoryId } }))
  ) {
    return new ApiError(422, "parentCategoryNotFound");
  }

  await prisma.category.update({
    where: { id },
    data: { name, parentCategoryId },
  });
}

async function deleteCategoryById(id: number) {
  if (!(await prisma.category.findUnique({ where: { id } }))) {
    return new ApiError(404);
  }

  await prisma.category.delete({ where: { id } });
}

export {
  createCategory,
  getCategories,
  updateCategoryById,
  deleteCategoryById,
};
