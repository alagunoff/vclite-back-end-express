import { VALIDATION_ERROR_MESSAGES } from "src/shared/validation/constants";
import { isNotEmptyString } from "src/shared/validation/validators";

function validateLoginData(data: any) {
  const errors: {
    username?: string;
    password?: string;
  } = {};

  if ("username" in data) {
    if (!isNotEmptyString(data.username)) {
      errors.username = VALIDATION_ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.username = VALIDATION_ERROR_MESSAGES.required;
  }

  if ("password" in data) {
    if (!isNotEmptyString(data.password)) {
      errors.password = VALIDATION_ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.password = VALIDATION_ERROR_MESSAGES.required;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export { validateLoginData };
