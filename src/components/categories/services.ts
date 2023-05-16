import { Prisma, type Category } from "@prisma/client";

import prisma from "src/shared/prisma";
import { type ValidatedPaginationQueryParameters } from "src/shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "src/shared/pagination/utils";

import { type ValidatedCreationData, type ValidatedUpdateData } from "./types";
import { includeSubcategories } from "./utils";

async function createCategory(
  { name, parentCategoryId }: ValidatedCreationData,
  onSuccess: () => void,
  onFailure: (
    reason?: "categoryAlreadyExists" | "parentCategoryNotFound"
  ) => void
): Promise<void> {
  try {
    await prisma.category.create({
      data: {
        name,
        parentCategory: {
          connect:
            typeof parentCategoryId === "number"
              ? { id: parentCategoryId }
              : undefined,
        },
      },
    });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2002":
          onFailure("categoryAlreadyExists");
          break;
        case "P2025":
          onFailure("parentCategoryNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
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
    orderBy: {
      id: "asc",
    },
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
  onSuccess: () => void,
  onFailure: (
    reason?:
      | "categoryNotFound"
      | "categoryAlreadyExists"
      | "parentCategoryNotFound"
  ) => void
): Promise<void> {
  try {
    await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
        parentCategory: {
          disconnect: parentCategoryId === null ? true : undefined,
          connect:
            typeof parentCategoryId === "number"
              ? {
                  id: parentCategoryId,
                }
              : undefined,
        },
      },
    });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure(
            error.meta?.cause === "Record to update not found."
              ? "categoryNotFound"
              : "parentCategoryNotFound"
          );
          break;
        case "P2002":
          onFailure("categoryAlreadyExists");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

async function deleteCategoryById(
  id: number,
  onSuccess: () => void,
  onFailure: (reason?: "categoryNotFound") => void
): Promise<void> {
  try {
    await prisma.category.delete({ where: { id } });

    onSuccess();
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case "P2025":
          onFailure("categoryNotFound");
          break;
        default:
          onFailure();
      }
    } else {
      onFailure();
    }
  }
}

export {
  createCategory,
  getCategories,
  updateCategoryById,
  deleteCategoryById,
};
