import prisma from "prisma";
import { isNotEmptyString } from "shared/validation/utils";

interface CreationDataValidationErrors {
  name?: string;
}

async function validateCreationData(
  data: any
): Promise<CreationDataValidationErrors | undefined> {
  const errors: CreationDataValidationErrors = {};

  if ("name" in data) {
    if (isNotEmptyString(data.name)) {
      if (await prisma.tag.findUnique({ where: { name: data.name } })) {
        errors.name = "tag with the same name already exists";
      }
    } else {
      errors.name = "must be not empty string";
    }
  } else {
    errors.name = "required";
  }

  return Object.keys(errors).length ? errors : undefined;
}

interface UpdateDataValidationErrors {
  name?: string;
}

async function validateUpdateData(
  data: any
): Promise<UpdateDataValidationErrors | undefined> {
  const errors: UpdateDataValidationErrors = {};

  if ("name" in data) {
    if (isNotEmptyString(data.name)) {
      if (await prisma.tag.findUnique({ where: { name: data.name } })) {
        errors.name = "tag with the same name already exists";
      }
    } else {
      errors.name = "must be not empty string";
    }
  }

  return Object.keys(errors).length ? errors : undefined;
}

export { validateCreationData, validateUpdateData };
