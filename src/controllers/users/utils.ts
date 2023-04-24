import { type ValidationResult } from "shared/types/validation";
import {
  isNotEmptyString,
  isBase64ImageDataUrl,
} from "shared/utils/validators";

function validateRequestBody(data: any): ValidationResult {
  const errors: Record<string, unknown> = {};

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

  if ("firstName" in data && !isNotEmptyString(data.firstName)) {
    errors.firstName = "must be not empty string";
  }

  if ("lastName" in data && !isNotEmptyString(data.lastName)) {
    errors.lastName = "must be not empty string";
  }

  return Object.keys(errors).length
    ? { isValid: false, errors }
    : { isValid: true, errors: null };
}

export { validateRequestBody };
