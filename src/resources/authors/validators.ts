import { VALIDATION_ERROR_MESSAGES } from "src/shared/validation/constants";
import {
  isNotEmptyString,
  isPositiveInteger,
} from "src/shared/validation/validators";

import { type ValidationErrors } from "./types";

function validateCreationData(data: any) {
  const errors: ValidationErrors = {};

  if ("description" in data && !isNotEmptyString(data.description)) {
    errors.description = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if ("userId" in data) {
    if (!isPositiveInteger(data.userId)) {
      errors.userId = VALIDATION_ERROR_MESSAGES.positiveInteger;
    }
  } else {
    errors.userId = VALIDATION_ERROR_MESSAGES.required;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

function validateUpdateData(data: any) {
  const errors: ValidationErrors = {};

  if ("description" in data && !isNotEmptyString(data.description)) {
    errors.description = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export { validateCreationData, validateUpdateData };
