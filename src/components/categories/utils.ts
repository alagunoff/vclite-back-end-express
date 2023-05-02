import prisma from "prisma";
import { isNotEmptyString, isPositiveInteger } from "shared/validation/utils";

interface CreationDataValidationErrors {
  name?: string;
  parentCategoryId?: string;
}

async function validateCreationData(
  data: any
): Promise<CreationDataValidationErrors | undefined> {
  const errors: CreationDataValidationErrors = {};

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

  return Object.keys(errors).length ? errors : undefined;
}

interface CategoryWithSubcategories {
  id: number;
  name: string;
  subcategories?: CategoryWithSubcategories[];
}

async function includeSubcategories(
  category: CategoryWithSubcategories
): Promise<void> {
  const subcategories = await prisma.category.findMany({
    where: {
      parentCategoryId: category.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (subcategories.length) {
    category.subcategories = subcategories;

    for (const subcategory of subcategories) {
      await includeSubcategories(subcategory);
    }
  }
}

interface UpdateDataValidationErrors {
  name?: string;
  parentCategoryId?: string;
}

async function validateUpdateData(
  data: any
): Promise<UpdateDataValidationErrors | undefined> {
  const errors: UpdateDataValidationErrors = {};

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

  return Object.keys(errors).length ? errors : undefined;
}

export { validateCreationData, includeSubcategories, validateUpdateData };
