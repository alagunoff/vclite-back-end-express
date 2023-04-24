import prisma from "prisma";
import { isNotEmptyString } from "shared/utils/validation";

async function validateCreationData(
  data: any
): Promise<Record<string, string> | undefined> {
  const errors: Record<string, string> = {};

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

async function validateUpdateData(
  data: any
): Promise<Record<string, string> | undefined> {
  const errors: Record<string, string> = {};

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
