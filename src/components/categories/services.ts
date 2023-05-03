import { type Category } from "@prisma/client";

import prisma from "prisma";
import { type ValidatedPaginationQueryParameters } from "shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "shared/pagination/utils";

import { type ValidatedCreationData, type ValidatedUpdateData } from "./types";
import { includeSubcategories } from "./utils";

async function createCategory(
  { name, parentCategoryId }: ValidatedCreationData,
  onSuccess: () => void
): Promise<void> {
  await prisma.category.create({ data: { name, parentCategoryId } });

  onSuccess();
}

async function getCategories(
  validatedPaginationQueryParameters: ValidatedPaginationQueryParameters,
  onSuccess: (
    categories: Array<Omit<Category, "parentCategoryId">>,
    categoriesTotalNumber: number,
    pagesTotalNumber: number
  ) => void
): Promise<void> {
  const categories = await prisma.category.findMany({
    where: {
      parentCategoryId: null,
    },
    ...createPaginationParameters(validatedPaginationQueryParameters),
    select: {
      id: true,
      name: true,
    },
  });
  const categoriesTotalNumber = await prisma.category.count({
    where: { parentCategoryId: null },
  });

  for (const category of categories) {
    await includeSubcategories(category);
  }

  onSuccess(
    categories,
    categoriesTotalNumber,
    calculatePagesTotalNumber(categoriesTotalNumber, categories.length)
  );
}

async function updateCategoryById(
  id: number,
  { name, parentCategoryId }: ValidatedUpdateData,
  onSuccess: () => void
): Promise<void> {
  await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      parentCategoryId,
    },
  });

  onSuccess();
}

async function deleteCategoryById(
  id: number,
  onSuccess: () => void,
  onFailure: () => void
): Promise<void> {
  try {
    await prisma.category.delete({ where: { id } });

    onSuccess();
  } catch (error) {
    console.log(error);

    onFailure();
  }
}

export {
  createCategory,
  getCategories,
  updateCategoryById,
  deleteCategoryById,
};
