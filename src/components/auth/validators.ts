import { ERROR_MESSAGES } from "src/shared/validation/constants";
import { isNotEmptyString } from "src/shared/validation/validators";

import { type ValidationErrors } from "./types";

function validateLoginData(data: any): ValidationErrors | undefined {
  const errors: ValidationErrors = {};

  if ("username" in data) {
    if (!isNotEmptyString(data.username)) {
      errors.username = ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.username = ERROR_MESSAGES.required;
  }

  if ("password" in data) {
    if (!isNotEmptyString(data.password)) {
      errors.password = ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.password = ERROR_MESSAGES.required;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export { validateLoginData };
