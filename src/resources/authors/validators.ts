import { VALIDATION_ERROR_MESSAGES } from "shared/validation/constants";
import {
  checkIfValueIsNotEmptyString,
  isPositiveInteger,
} from "shared/validation/validators";

import { type ValidationErrors } from "./types";

function validateCreationData(data: any) {
  const errors: ValidationErrors = {};

  if (
    "description" in data &&
    !checkIfValueIsNotEmptyString(data.description)
  ) {
    errors.description = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if ("userId" in data) {
    if (!isPositiveInteger(data.userId)) {
      errors.userId = VALIDATION_ERROR_MESSAGES.positiveInteger;
    }
  } else {
    errors.userId = VALIDATION_ERROR_MESSAGES.required;
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

function validateUpdateData(data: any) {
  const errors: ValidationErrors = {};

  if (
    "description" in data &&
    !checkIfValueIsNotEmptyString(data.description)
  ) {
    errors.description = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

export { validateCreationData, validateUpdateData };
