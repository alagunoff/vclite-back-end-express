import { type Prisma } from "@prisma/client";

import { ApiError } from "shared/errors/classes";
import { DEFAULT_ORDER_PARAMETERS } from "shared/ordering/constants";
import { type PaginationParameters } from "shared/pagination/types";
import { calculatePagesTotalNumber } from "shared/pagination/utils";
import { prisma } from "shared/prisma";

import { includeSubcategories } from "./utils";

async function createCategory(creationData: {
  name: string;
  parentCategoryId?: number;
}) {
  if (
    await prisma.category.findUnique({ where: { name: creationData.name } })
  ) {
    return new ApiError(422, "categoryAlreadyExists");
  }

  if (
    creationData.parentCategoryId &&
    !(await prisma.category.findUnique({
      where: { id: creationData.parentCategoryId },
    }))
  ) {
    return new ApiError(422, "parentCategoryNotFound");
  }

  await prisma.category.create({ data: creationData });
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

async function updateCategory(
  filterParameters: Prisma.CategoryUpdateArgs["where"],
  updateData: { name?: string; parentCategoryId?: number | null }
) {
  if (!(await prisma.category.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  if (
    updateData.name &&
    (await prisma.category.findUnique({ where: { name: updateData.name } }))
  ) {
    return new ApiError(422, "categoryAlreadyExists");
  }

  if (
    updateData.parentCategoryId &&
    !(await prisma.category.findUnique({
      where: { id: updateData.parentCategoryId },
    }))
  ) {
    return new ApiError(422, "parentCategoryNotFound");
  }

  await prisma.category.update({
    where: filterParameters,
    data: updateData,
  });
}

async function deleteCategory(
  filterParameters: Prisma.CategoryDeleteArgs["where"]
) {
  if (!(await prisma.category.findUnique({ where: filterParameters }))) {
    return new ApiError(404);
  }

  await prisma.category.delete({ where: filterParameters });
}

export { createCategory, getCategories, updateCategory, deleteCategory };
