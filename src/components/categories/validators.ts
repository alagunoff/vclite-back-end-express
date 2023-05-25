import { ERROR_MESSAGES } from "src/shared/validation/constants";
import {
  isNotEmptyString,
  isPositiveInteger,
} from "src/shared/validation/validators";

import { type ValidationErrors } from "./types";

function validateCreationData(data: any): ValidationErrors | undefined {
  const errors: ValidationErrors = {};

  if ("name" in data) {
    if (!isNotEmptyString(data.name)) {
      errors.name = ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.name = ERROR_MESSAGES.required;
  }

  if ("parentCategoryId" in data && !isPositiveInteger(data.parentCategoryId)) {
    errors.parentCategoryId = ERROR_MESSAGES.positiveInteger;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

function validateUpdateData(data: any): ValidationErrors | undefined {
  const errors: ValidationErrors = {};

  if ("name" in data && !isNotEmptyString(data.name)) {
    errors.name = ERROR_MESSAGES.notEmptyString;
  }

  if (
    "parentCategoryId" in data &&
    !isPositiveInteger(data.parentCategoryId) &&
    data.parentCategoryId !== null
  ) {
    errors.parentCategoryId = "must be positive integer or null";
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export { validateCreationData, validateUpdateData };
