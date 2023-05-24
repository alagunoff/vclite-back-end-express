import { ERROR_MESSAGES } from "src/shared/validation/constants";
import {
  isNotEmptyString,
  isBase64ImageDataUrl,
} from "src/shared/validation/validators";

import { type ValidationErrors } from "./types";

function validateCreationData(data: any): ValidationErrors | undefined {
  const errors: ValidationErrors = {};

  if ("image" in data) {
    if (!isBase64ImageDataUrl(data.image)) {
      errors.image = ERROR_MESSAGES.base64ImageDataUrl;
    }
  } else {
    errors.image = ERROR_MESSAGES.required;
  }

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

  if ("firstName" in data && !isNotEmptyString(data.firstName)) {
    errors.firstName = ERROR_MESSAGES.notEmptyString;
  }

  if ("lastName" in data && !isNotEmptyString(data.lastName)) {
    errors.lastName = ERROR_MESSAGES.notEmptyString;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export { validateCreationData };
