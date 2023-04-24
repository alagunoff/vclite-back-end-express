import { type ValidationResult } from "shared/types/validation";
import { isNotEmptyString } from "shared/utils/validators";

function validateRequestBody(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  if ("username" in data) {
    if (!isNotEmptyString(data.username)) {
      errors.username = "must be not empty string";
    }
  } else {
    errors.username = "required";
  }

  if ("password" in data) {
    if (!isNotEmptyString(data.password)) {
      errors.password = "must be not empty string";
    }
  } else {
    errors.password = "required";
  }

  return Object.keys(errors).length
    ? { isValid: false, errors }
    : { isValid: true, errors: null };
}

export { validateRequestBody };
