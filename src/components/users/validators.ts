import {
  isNotEmptyString,
  isBase64ImageDataUrl,
} from "src/shared/validation/validators";

import { type ValidationErrors } from "./types";

function validateCreationData(data: any): ValidationErrors | undefined {
  const errors: ValidationErrors = {};

  if ("image" in data) {
    if (!isBase64ImageDataUrl(data.image)) {
      errors.image = "must be base64 image in data URL format with mediatype";
    }
  } else {
    errors.image = "required";
  }

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

  if ("firstName" in data) {
    if (!isNotEmptyString(data.firstName)) {
      errors.firstName = "must be not empty string";
    }
  }

  if ("lastName" in data) {
    if (!isNotEmptyString(data.lastName)) {
      errors.lastName = "must be not empty string";
    }
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export { validateCreationData };
