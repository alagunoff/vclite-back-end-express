import prisma from "shared/prisma";
import { isNotEmptyString, isPositiveInteger } from "shared/validation/utils";

import {
  type ValidatedCreationData,
  type ValidatedUpdateData,
  type ValidationErrors,
} from "./types";

async function validateCreationData(data: any): Promise<
  | {
      validatedData: ValidatedCreationData;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: ValidationErrors;
    }
> {
  const errors: ValidationErrors = {};

  if ("name" in data) {
    if (isNotEmptyString(data.name)) {
      if (await prisma.category.findUnique({ where: { name: data.name } })) {
        errors.name = "category with the same name already exists";
      }
    } else {
      errors.name = "must be not empty string";
    }
  } else {
    errors.name = "required";
  }

  if ("parentCategoryId" in data) {
    if (isPositiveInteger(data.parentCategoryId)) {
      if (
        !(await prisma.category.findUnique({
          where: { id: data.parentCategoryId },
        }))
      ) {
        errors.parentCategoryId = "parent category with this id doesn't exist";
      }
    } else {
      errors.parentCategoryId = "must be positive integer";
    }
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData: {
          name: data.name,
          parentCategoryId: data.parentCategoryId,
        },
        errors: undefined,
      };
}

async function validateUpdateData(data: any): Promise<
  | {
      validatedData: ValidatedUpdateData;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: ValidationErrors;
    }
> {
  const errors: ValidationErrors = {};

  if ("name" in data) {
    if (isNotEmptyString(data.name)) {
      if (await prisma.category.findUnique({ where: { name: data.name } })) {
        errors.name = "category with the same name already exists";
      }
    } else {
      errors.name = "must be not empty string";
    }
  }

  if ("parentCategoryId" in data) {
    const isParentCategoryIdPositiveInteger = isPositiveInteger(
      data.parentCategoryId
    );

    if (isParentCategoryIdPositiveInteger || data.parentCategoryId === null) {
      if (
        isParentCategoryIdPositiveInteger &&
        !(await prisma.category.findUnique({
          where: { id: data.parentCategoryId },
        }))
      ) {
        errors.parentCategoryId = "parent category with this id doesn't exist";
      }
    } else {
      errors.parentCategoryId = "must be positive integer or null";
    }
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData: {
          name: data.name,
          parentCategoryId: data.parentCategoryId,
        },
        errors: undefined,
      };
}

export { validateCreationData, validateUpdateData };
