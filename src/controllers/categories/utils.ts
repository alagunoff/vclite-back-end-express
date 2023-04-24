import prisma from "prisma";
import { isNotEmptyString, isPositiveInteger } from "shared/utils/validation";

async function validateCreationData(
  data: any
): Promise<Record<string, string> | undefined> {
  const errors: Record<string, string> = {};

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
        errors.parentCategoryId = "parent category with this id wasn't found";
      }
    } else {
      errors.parentCategoryId = "must be positive integer";
    }
  }

  return Object.keys(errors).length ? errors : undefined;
}

async function validateUpdateData(
  data: any
): Promise<Record<string, string> | undefined> {
  const errors: Record<string, string> = {};

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
        errors.parentCategoryId = "category with this id wasn't found";
      }
    } else {
      errors.parentCategoryId = "must be positive integer or null";
    }
  }

  return Object.keys(errors).length ? errors : undefined;
}

export { validateCreationData, validateUpdateData };
