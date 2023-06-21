import { VALIDATION_ERROR_MESSAGES } from "shared/validation/constants";
import { checkIfValueIsNotEmptyString } from "shared/validation/validators";

function validateLoginData(data: any) {
  const errors: {
    username?: string;
    password?: string;
  } = {};

  if ("username" in data) {
    if (!checkIfValueIsNotEmptyString(data.username)) {
      errors.username = VALIDATION_ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.username = VALIDATION_ERROR_MESSAGES.required;
  }

  if ("password" in data) {
    if (!checkIfValueIsNotEmptyString(data.password)) {
      errors.password = VALIDATION_ERROR_MESSAGES.notEmptyString;
    }
  } else {
    errors.password = VALIDATION_ERROR_MESSAGES.required;
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

export { validateLoginData };
