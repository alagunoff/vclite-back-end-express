import prisma from "prisma";
import {
  isNotEmptyString,
  isBase64ImageDataUrl,
} from "shared/utils/validation";

interface CreationDataValidationErrors {
  image?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

async function validateCreationData(
  data: any
): Promise<CreationDataValidationErrors | undefined> {
  const errors: CreationDataValidationErrors = {};

  if ("image" in data) {
    if (!isBase64ImageDataUrl(data.image)) {
      errors.image = "must be base64 image in data URL format with mediatype";
    }
  } else {
    errors.image = "required";
  }

  if ("username" in data) {
    if (isNotEmptyString(data.username)) {
      if (
        await prisma.user.findUnique({ where: { username: data.username } })
      ) {
        errors.username = "user with the same username already exists";
      }
    } else {
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

  return Object.keys(errors).length ? errors : undefined;
}

export { validateCreationData };
