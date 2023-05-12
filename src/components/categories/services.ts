import { Prisma, type Category } from "@prisma/client";

import prisma from "src/shared/prisma";
import { type ValidatedPaginationQueryParameters } from "src/shared/pagination/types";
import {
  createPaginationParameters,
  calculatePagesTotalNumber,
} from "src/shared/pagination/utils";

import { type ValidatedCreationData, type ValidatedUpdateData } from "./types";
import { includeSubcategories } from "./utils";
import {
  type CREATION_FAILURE_REASON_TO_RESPONSE_MESSAGE,
  type UPDATE_FAILURE_REASON_TO_RESPONSE_MESSAGE,
  type DELETION_FAILURE_REASON_TO_RESPONSE_MESSAGE,
} from "./constants";

async function createCategory(
  { name, parentCategoryId }: ValidatedCreationData,
  onSuccess: () => void,
  onFailure: (
    reason: keyof typeof CREATION_FAILURE_REASON_TO_RESPONSE_MESSAGE
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
          onFailure("unknown");
      }
    } else {
      onFailure("unknown");
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
    reason: keyof typeof UPDATE_FAILURE_REASON_TO_RESPONSE_MESSAGE
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
        case "P2002":
          onFailure("categoryAlreadyExists");
          break;
        case "P2025":
          onFailure(
            error.meta?.cause === "Record to update not found."
              ? "categoryNotFound"
              : "parentCategoryNotFound"
          );
          break;
        default:
          onFailure("unknown");
      }
    } else {
      onFailure("unknown");
    }
  }
}

async function deleteCategoryById(
  id: number,
  onSuccess: () => void,
  onFailure: (
    reason: keyof typeof DELETION_FAILURE_REASON_TO_RESPONSE_MESSAGE
  ) => void
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
          onFailure("unknown");
      }
    } else {
      onFailure("unknown");
    }
  }
}

export {
  createCategory,
  getCategories,
  updateCategoryById,
  deleteCategoryById,
};
