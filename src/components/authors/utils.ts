import prisma from "prisma";
import { isNotEmptyString, isPositiveInteger } from "shared/validation/utils";

interface CreationDataValidationErrors {
  description?: string;
  userId?: string;
}

async function validateCreationData(
  data: any
): Promise<CreationDataValidationErrors | undefined> {
  const errors: CreationDataValidationErrors = {};

  if ("description" in data) {
    if (!isNotEmptyString(data.description)) {
      errors.description = "must be not empty string";
    }
  }

  if ("userId" in data) {
    if (isPositiveInteger(data.userId)) {
      if (!(await prisma.user.findUnique({ where: { id: data.userId } }))) {
        errors.userId = "user with this id doesn't exist";
      }
    } else {
      errors.userId = "must be positive integer";
    }
  } else {
    errors.userId = "required";
  }

  return Object.keys(errors).length ? errors : undefined;
}

interface UpdateDataValidationErrors {
  description?: string;
}

function validateUpdateData(data: any): UpdateDataValidationErrors | undefined {
  const errors: UpdateDataValidationErrors = {};

  if ("description" in data) {
    if (!isNotEmptyString(data.description)) {
      errors.description = "must be not empty string";
    }
  }

  return Object.keys(errors).length ? errors : undefined;
}

export { validateCreationData, validateUpdateData };
