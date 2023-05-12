import {
  isNotEmptyString,
  isPositiveInteger,
} from "src/shared/validation/utils";

import {
  type ValidatedCreationData,
  type ValidatedUpdateData,
  type ValidationErrors,
} from "./types";

function validateCreationData(data: any):
  | {
      validatedData: ValidatedCreationData;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: ValidationErrors;
    } {
  const errors: ValidationErrors = {};

  if ("name" in data) {
    if (!isNotEmptyString(data.name)) {
      errors.name = "must be not empty string";
    }
  } else {
    errors.name = "required";
  }

  if ("parentCategoryId" in data) {
    if (!isPositiveInteger(data.parentCategoryId)) {
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

function validateUpdateData(data: any):
  | {
      validatedData: ValidatedUpdateData;
      errors: undefined;
    }
  | {
      validatedData: undefined;
      errors: ValidationErrors;
    } {
  const errors: ValidationErrors = {};

  if ("name" in data) {
    if (!isNotEmptyString(data.name)) {
      errors.name = "must be not empty string";
    }
  }

  if ("parentCategoryId" in data) {
    if (
      data.parentCategoryId !== null &&
      !isPositiveInteger(data.parentCategoryId)
    ) {
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
