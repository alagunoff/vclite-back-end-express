import { VALIDATION_ERROR_MESSAGES } from "shared/validation/constants";
import {
  isUsername,
  isNotEmptyString,
  isBase64WebpImageDataUrl,
} from "shared/validation/validators";

function validateCreationData(data: any) {
  const errors: {
    image?: string;
    username?: string;
    password?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
  } = {};

  if ("image" in data) {
    if (!isBase64WebpImageDataUrl(data.image)) {
      errors.image = VALIDATION_ERROR_MESSAGES.base64WebpImageDataUrl;
    }
  } else {
    errors.image = VALIDATION_ERROR_MESSAGES.required;
  }

  if ("username" in data) {
    if (!isUsername(data.username)) {
      errors.username =
        "username must start with lowercased latin letter optionally followed by any number of lowercased latin letters or numbers";
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

  if ("email" in data) {
    if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(data.email)) {
      errors.email = "must be valid email";
    }
  } else {
    errors.email = VALIDATION_ERROR_MESSAGES.required;
  }

  if ("firstName" in data && !isNotEmptyString(data.firstName)) {
    errors.firstName = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if ("lastName" in data && !isNotEmptyString(data.lastName)) {
    errors.lastName = VALIDATION_ERROR_MESSAGES.notEmptyString;
  }

  if (Object.keys(errors).length) {
    return errors;
  }
}

export { validateCreationData };
