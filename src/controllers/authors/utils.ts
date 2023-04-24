import { type ValidationResult } from "shared/types/validation";
import { isNotEmptyString, isPositiveInteger } from "shared/utils/validators";

function validateRequestBody(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  if ("description" in data && !isNotEmptyString(data.description)) {
    errors.description = "must be not empty string";
  }

  if ("userId" in data) {
    if (!isPositiveInteger(data.userId)) {
      errors.image = "must be positive integer";
    }
  } else {
    errors.userId = "required";
  }

  return Object.keys(errors).length
    ? { isValid: false, errors }
    : { isValid: true, errors: null };
}

export { validateRequestBody };
