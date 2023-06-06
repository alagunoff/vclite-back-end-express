import { VALIDATION_ERROR_MESSAGES } from "shared/validation/constants";
import { isNotEmptyString } from "shared/validation/validators";

import { type ValidationErrors } from "./types";

function validateCreationData(data: any) {
  const errors: ValidationErrors = {};

  if ("name" in data) {
    if (!isNotEmptyString(data.name)) {
      errors.name = VALIDATION_ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.name = VALIDATION_ERROR_MESSAGES.required;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

function validateUpdateData(data: any) {
  const errors: ValidationErrors = {};

  if ("name" in data && !isNotEmptyString(data.name)) {
    errors.name = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export { validateCreationData, validateUpdateData };
