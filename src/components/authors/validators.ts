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

  if ("description" in data) {
    if (!isNotEmptyString(data.description)) {
      errors.description = "must be not empty string";
    }
  }

  if ("userId" in data) {
    if (!isPositiveInteger(data.userId)) {
      errors.userId = "must be positive integer";
    }
  } else {
    errors.userId = "required";
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData: {
          description: data.description,
          userId: data.userId,
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

  if ("description" in data) {
    if (!isNotEmptyString(data.description)) {
      errors.description = "must be not empty string";
    }
  }

  return Object.keys(errors).length
    ? {
        validatedData: undefined,
        errors,
      }
    : {
        validatedData: {
          description: data.description,
        },
        errors: undefined,
      };
}

export { validateCreationData, validateUpdateData };
