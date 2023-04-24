import {
  isNotEmptyString,
  isBase64ImageDataUrl,
  createValidationResult,
} from "shared/utils/validation";

function validateCreationData(
  data: any
): ReturnType<typeof createValidationResult> {
  const errors: Record<string, string> = {};

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

  return createValidationResult(errors);
}

export { validateCreationData };
