import {
  checkIfValueIsNotEmptyString,
  checkIfValueIsBase64WebpImageDataUrl,
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

  if (Object.hasOwn(data, "image")) {
    if (!checkIfValueIsBase64WebpImageDataUrl(data.image)) {
      errors.image =
        'must be base64 image in data URL format with "image/webp" mediatype';
    }
  } else {
    errors.image = "required";
  }

  if (Object.hasOwn(data, "username")) {
    if (
      checkIfValueIsNotEmptyString(data.username) &&
      /^[a-z][a-z0-9]*$/.test(data.username)
    ) {
      errors.username =
        "username must start with lowercased latin letter optionally followed by any number of lowercased latin letters or numbers";
    }
  } else {
    errors.username = "required";
  }

  if (Object.hasOwn(data, "password")) {
    if (!checkIfValueIsNotEmptyString(data.password)) {
      errors.password = "must be not empty string";
    }
  } else {
    errors.password = "required";
  }

  if (Object.hasOwn(data, "email")) {
    if (!/[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(data.email)) {
      errors.email = "must be valid email";
    }
  } else {
    errors.email = "required";
  }

  if (
    Object.hasOwn(data, "firstName") &&
    !checkIfValueIsNotEmptyString(data.firstName)
  ) {
    errors.firstName = "must be not empty string";
  }

  if (
    Object.hasOwn(data, "lastName") &&
    !checkIfValueIsNotEmptyString(data.lastName)
  ) {
    errors.lastName = "must be not empty string";
  }

  if (Object.keys(errors).length !== 0) {
    return errors;
  }
}

export { validateCreationData };
