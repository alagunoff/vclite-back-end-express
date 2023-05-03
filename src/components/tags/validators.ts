import prisma from "prisma";
import { isNotEmptyString } from "shared/validation/utils";

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
      if (await prisma.tag.findUnique({ where: { name: data.name } })) {
        errors.name = "tag with the same name already exists";
      }
    } else {
      errors.name = "must be not empty string";
    }
  } else {
    errors.name = "required";
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData: {
          name: data.name,
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
      if (await prisma.tag.findUnique({ where: { name: data.name } })) {
        errors.name = "tag with the same name already exists";
      }
    } else {
      errors.name = "must be not empty string";
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
        },
        errors: undefined,
      };
}

export { validateCreationData, validateUpdateData };
