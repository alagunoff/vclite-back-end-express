import { VALIDATION_ERROR_MESSAGES } from "shared/validation/constants";
import {
  checkIfValueIsNotEmptyString,
  checkIfValueIsPositiveInteger,
} from "shared/validation/validators";

import { type ValidationErrors } from "./types";

function validateCreationData(data: any) {
  const errors: ValidationErrors = {};

  if ("name" in data) {
    if (!checkIfValueIsNotEmptyString(data.name)) {
      errors.name = VALIDATION_ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.name = VALIDATION_ERROR_MESSAGES.required;
  }

  if (
    "parentCategoryId" in data &&
    !checkIfValueIsPositiveInteger(data.parentCategoryId)
  ) {
    errors.parentCategoryId = VALIDATION_ERROR_MESSAGES.positiveInteger;
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

function validateUpdateData(data: any) {
  const errors: ValidationErrors = {};

  if ("name" in data && !checkIfValueIsNotEmptyString(data.name)) {
    errors.name = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if (
    "parentCategoryId" in data &&
    !checkIfValueIsPositiveInteger(data.parentCategoryId) &&
    data.parentCategoryId !== null
  ) {
    errors.parentCategoryId = "must be positive integer or null";
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

export { validateCreationData, validateUpdateData };
